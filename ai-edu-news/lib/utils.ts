import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스 병합
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: string | Date, locale: 'ko' | 'en' = 'ko'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (locale === 'ko') {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } else {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  }
}

/**
 * 상대 시간 (예: "3시간 전")
 */
export function timeAgo(date: string | Date, locale: 'ko' | 'en' = 'ko'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const intervals = {
    ko: {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    },
    en: {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    },
  };

  const names = {
    ko: ['년', '개월', '주', '일', '시간', '분'],
    en: ['year', 'month', 'week', 'day', 'hour', 'minute'],
  };

  const values = Object.values(intervals[locale]);
  for (let i = 0; i < values.length; i++) {
    const interval = Math.floor(seconds / values[i]);
    if (interval >= 1) {
      if (locale === 'ko') {
        return `${interval}${names.ko[i]} 전`;
      } else {
        return `${interval} ${names.en[i]}${interval > 1 ? 's' : ''} ago`;
      }
    }
  }

  return locale === 'ko' ? '방금 전' : 'just now';
}

/**
 * Slug 생성 (URL 친화적)
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 -로
    .replace(/-+/g, '-') // 중복 - 제거
    .substring(0, 100); // 최대 100자
}

/**
 * 텍스트 잘라내기
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * 숫자 포맷팅 (1000 → 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * 이메일 검증
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * 카테고리 색상
 */
export function getCategoryColor(category: 'AI' | 'Education' | 'AI+Education'): string {
  const colors = {
    AI: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Education: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'AI+Education': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };
  return colors[category];
}

/**
 * 국가 플래그 이모지
 */
export function getCountryFlag(country: 'KR' | 'US'): string {
  return country === 'KR' ? '🇰🇷' : '🇺🇸';
}
