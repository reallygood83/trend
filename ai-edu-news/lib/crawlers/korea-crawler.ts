/**
 * 한국 AI/교육 뉴스 크롤러
 * RSS 및 HTML 파싱
 */

import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RawNews } from '@/types/firestore';

const parser = new Parser();

// 한국 뉴스 소스
const KOREA_SOURCES = {
  AI: [
    {
      name: 'AI타임스',
      type: 'rss' as const,
      url: 'https://www.aitimes.com/rss/allArticle.xml',
    },
    {
      name: 'ZDNet Korea AI',
      type: 'rss' as const,
      url: 'https://zdnet.co.kr/rss/news.xml',
      filter: (title: string) =>
        title.includes('AI') || title.includes('인공지능') || title.includes('머신러닝'),
    },
    {
      name: '전자신문 AI',
      type: 'rss' as const,
      url: 'https://rss.etnews.com/Section901.xml',
    },
  ],
  Education: [
    {
      name: '에듀프레스',
      type: 'rss' as const,
      url: 'http://www.edupress.kr/rss/allArticle.xml',
    },
    {
      name: '대학저널',
      type: 'rss' as const,
      url: 'http://www.dhnews.co.kr/rss/allArticle.xml',
    },
  ],
};

/**
 * 한국 뉴스 크롤링
 */
export async function crawlKoreaNews(): Promise<RawNews[]> {
  const allArticles: RawNews[] = [];

  // AI 뉴스
  for (const source of KOREA_SOURCES.AI) {
    try {
      const articles = await crawlRSS(source, 'AI', 'KR');
      allArticles.push(...articles);
    } catch (error) {
      console.error(`Failed to crawl ${source.name}:`, error);
    }
  }

  // 교육 뉴스
  for (const source of KOREA_SOURCES.Education) {
    try {
      const articles = await crawlRSS(source, 'Education', 'KR');
      allArticles.push(...articles);
    } catch (error) {
      console.error(`Failed to crawl ${source.name}:`, error);
    }
  }

  return allArticles;
}

/**
 * RSS 파싱
 */
async function crawlRSS(
  source: any,
  category: 'AI' | 'Education',
  country: 'KR' | 'US'
): Promise<RawNews[]> {
  const feed = await parser.parseURL(source.url);

  const articles: RawNews[] = [];

  for (const item of feed.items.slice(0, 20)) {
    // 최근 20개만
    // 필터 적용 (있는 경우)
    if (source.filter && !source.filter(item.title || '')) {
      continue;
    }

    // AI+교육 키워드 체크
    const finalCategory = categorizeNews(item.title || '', category);

    articles.push({
      id: generateId(item.link || ''),
      title: item.title || '',
      content: stripHTML(item.contentSnippet || item.content || ''),
      source: source.name,
      url: item.link || '',
      publishedAt: item.pubDate || new Date().toISOString(),
      crawledAt: new Date().toISOString(),
      category: finalCategory,
      country: country,
      status: 'pending',
      keywords: extractKeywords(item.title || ''),
    });
  }

  return articles;
}

/**
 * 카테고리 자동 분류
 */
function categorizeNews(
  title: string,
  defaultCategory: 'AI' | 'Education'
): 'AI' | 'Education' | 'AI+Education' {
  const aiKeywords = ['AI', '인공지능', 'GPT', '챗봇', '딥러닝', '머신러닝', '생성형'];
  const eduKeywords = ['교육', '학교', '학생', '교사', '수업', '학습', '대학'];

  const hasAI = aiKeywords.some((kw) => title.includes(kw));
  const hasEdu = eduKeywords.some((kw) => title.includes(kw));

  if (hasAI && hasEdu) {
    return 'AI+Education';
  } else if (hasAI) {
    return 'AI';
  } else if (hasEdu) {
    return 'Education';
  }

  return defaultCategory;
}

/**
 * 키워드 추출
 */
function extractKeywords(title: string): string[] {
  const keywords = [
    'AI',
    '인공지능',
    'GPT',
    'ChatGPT',
    'Claude',
    '챗봇',
    '교육',
    '학교',
    '학생',
    '교사',
    '대학',
    '온라인',
    '디지털',
    '에듀테크',
  ];

  return keywords.filter((kw) => title.includes(kw));
}

/**
 * HTML 태그 제거
 */
function stripHTML(html: string): string {
  const $ = cheerio.load(html);
  return $.text().trim().substring(0, 500); // 500자로 제한
}

/**
 * ID 생성 (URL 기반)
 */
function generateId(url: string): string {
  // URL을 해시하여 고유 ID 생성
  const hash = Buffer.from(url).toString('base64').substring(0, 16);
  return hash.replace(/[^a-zA-Z0-9]/g, '');
}
