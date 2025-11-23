/**
 * 통합 뉴스 크롤러
 * 모든 소스에서 뉴스를 수집하고 Firestore에 저장
 */

import { crawlKoreaNews } from './korea-crawler';
import { crawlUSANews } from './usa-crawler';
import { adminDb } from '@/lib/firebase-admin';
import { RawNews, COLLECTIONS } from '@/types/firestore';
import admin from 'firebase-admin';

/**
 * 모든 뉴스 크롤링 (메인 함수)
 */
export async function crawlAllNews(): Promise<{
  success: boolean;
  totalNews: number;
  newNews: number;
  errors: string[];
}> {
  console.log('🔍 뉴스 크롤링 시작...');

  const errors: string[] = [];
  let allArticles: RawNews[] = [];

  // 한국 뉴스
  try {
    const koreaNews = await crawlKoreaNews();
    allArticles.push(...koreaNews);
    console.log(`✅ 한국 뉴스 ${koreaNews.length}개 수집`);
  } catch (error) {
    const msg = `한국 뉴스 크롤링 실패: ${error}`;
    console.error(msg);
    errors.push(msg);
  }

  // 미국 뉴스
  try {
    const usaNews = await crawlUSANews();
    allArticles.push(...usaNews);
    console.log(`✅ 미국 뉴스 ${usaNews.length}개 수집`);
  } catch (error) {
    const msg = `미국 뉴스 크롤링 실패: ${error}`;
    console.error(msg);
    errors.push(msg);
  }

  // 중복 제거
  const uniqueArticles = deduplicateNews(allArticles);
  console.log(`📊 총 ${allArticles.length}개 수집, 중복 제거 후 ${uniqueArticles.length}개`);

  // Firestore에 저장
  let newNews = 0;
  try {
    newNews = await saveToFirestore(uniqueArticles);
    console.log(`💾 Firestore에 ${newNews}개 새 뉴스 저장`);
  } catch (error) {
    const msg = `Firestore 저장 실패: ${error}`;
    console.error(msg);
    errors.push(msg);
  }

  // 크롤링 로그 저장
  await saveCrawlLog({
    success: errors.length === 0,
    totalNews: uniqueArticles.length,
    newNews: newNews,
  });

  return {
    success: errors.length === 0,
    totalNews: uniqueArticles.length,
    newNews: newNews,
    errors: errors,
  };
}

/**
 * 중복 제거 (URL 기반)
 */
function deduplicateNews(articles: RawNews[]): RawNews[] {
  const seen = new Set<string>();
  const unique: RawNews[] = [];

  for (const article of articles) {
    if (!seen.has(article.url)) {
      seen.add(article.url);
      unique.push(article);
    }
  }

  return unique;
}

/**
 * Firestore에 저장
 */
async function saveToFirestore(articles: RawNews[]): Promise<number> {
  const batch = adminDb.batch();
  let newCount = 0;

  for (const article of articles) {
    // 중복 체크 (URL 기반)
    const existing = await adminDb
      .collection(COLLECTIONS.RAW_NEWS)
      .where('url', '==', article.url)
      .limit(1)
      .get();

    if (existing.empty) {
      // 새 뉴스만 추가
      const docRef = adminDb.collection(COLLECTIONS.RAW_NEWS).doc(article.id);
      batch.set(docRef, {
        ...article,
        crawledAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      newCount++;
    }
  }

  await batch.commit();
  return newCount;
}

/**
 * 크롤링 로그 저장
 */
async function saveCrawlLog(result: {
  success: boolean;
  totalNews: number;
  newNews: number;
}): Promise<void> {
  await adminDb.collection(COLLECTIONS.CRAWL_LOGS).add({
    source: 'all',
    crawledAt: admin.firestore.FieldValue.serverTimestamp(),
    success: result.success,
    newsCount: result.newNews,
  });
}

/**
 * 오늘의 뉴스 가져오기 (관리자 대시보드용)
 */
export async function getTodayNews(filters?: {
  category?: 'AI' | 'Education' | 'AI+Education';
  country?: 'KR' | 'US';
  status?: 'pending' | 'selected' | 'processed' | 'published';
}): Promise<RawNews[]> {
  let query = adminDb
    .collection(COLLECTIONS.RAW_NEWS)
    .where('crawledAt', '>=', getStartOfDay())
    .orderBy('crawledAt', 'desc')
    .limit(100);

  if (filters?.category) {
    query = query.where('category', '==', filters.category);
  }
  if (filters?.country) {
    query = query.where('country', '==', filters.country);
  }
  if (filters?.status) {
    query = query.where('status', '==', filters.status);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as RawNews[];
}

/**
 * 오늘 00:00 타임스탬프
 */
function getStartOfDay(): admin.firestore.Timestamp {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return admin.firestore.Timestamp.fromDate(now);
}
