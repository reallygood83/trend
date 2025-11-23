# AI 교육 뉴스 - Feynman Style

> 교사와 AI 유튜버를 위한 AI/교육 뉴스 플랫폼
> 파인만 기법으로 복잡한 뉴스를 쉽게 재해석합니다.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange)](https://firebase.google.com/)
[![xAI Grok](https://img.shields.io/badge/xAI-Grok--4--1--fast-blue)](https://x.ai/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ 주요 기능

### 🤖 AI 기반 뉴스 재작성
- **xAI Grok-4-1-fast** 모델로 파인만 기법 적용
- 복잡한 AI/교육 뉴스를 누구나 이해할 수 있게 변환
- 리처드 파인만 교수의 3가지 질문 자동 생성

### 🌍 다국어 지원
- 한국어 / English 완벽 지원
- URL 기반 로케일 자동 감지
- 모든 UI와 이메일 템플릿 다국어화

### 📡 자동 뉴스 크롤링
- **한국**: AI타임스, ZDNet Korea, 전자신문, 에듀프레스 등
- **미국**: TechCrunch, VentureBeat, EdSurge, MIT Tech Review 등
- Reddit, Twitter 크롤링 지원 (선택)
- 매일 자동 실행 (Vercel Cron)

### 🎨 원클릭 워크플로우
1. 관리자 대시보드에서 뉴스 선택
2. "생성" 버튼 클릭 → AI가 파인만 스타일로 변환
3. WYSIWYG 에디터로 미리보기 및 편집
4. "발행" 버튼 클릭 → 블로그, SNS, 뉴스레터 자동 발송

### 📧 뉴스레터 자동 발송
- 주간/격주 뉴스레터 자동 생성
- Resend API를 통한 안정적 발송
- 오픈율/클릭률 추적

## 🏗️ 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + shadcn/ui
- **TipTap** (WYSIWYG 에디터)
- **next-intl** (다국어)

### Backend
- **Firebase Firestore** (데이터베이스)
- **Firebase Functions** (서버리스)
- **Firebase Auth** (관리자 인증)

### AI
- **xAI Grok-4-1-fast** (주력 모델)
- **OpenAI GPT-4** (Fallback)

### Newsletter
- **Resend** (이메일 발송)
- **React Email** (템플릿)

### Deployment
- **Vercel** (프론트엔드)
- **Firebase** (백엔드)

## 📁 프로젝트 구조

```
ai-edu-news/
├── app/                      # Next.js App Router
│   ├── [locale]/            # 다국어 라우팅
│   │   ├── page.tsx         # 홈 페이지
│   │   ├── posts/           # 뉴스 목록/상세
│   │   ├── admin/           # 관리자 대시보드
│   │   └── newsletter/      # 뉴스레터 구독
│   └── api/                 # API 라우트
│       ├── crawl/           # 크롤링 트리거
│       ├── generate/        # 파인만 생성
│       └── publish/         # 발행
│
├── components/              # React 컴포넌트
│   ├── admin/              # 관리자 전용
│   ├── editor/             # TipTap 에디터
│   ├── newsletter/         # 뉴스레터
│   └── ui/                 # shadcn/ui
│
├── lib/                     # 유틸리티 및 설정
│   ├── firebase-client.ts  # Firebase 클라이언트
│   ├── firebase-admin.ts   # Firebase Admin
│   ├── grok-client.ts      # xAI Grok API
│   └── crawlers/           # 뉴스 크롤러
│       ├── korea-crawler.ts
│       ├── usa-crawler.ts
│       └── index.ts
│
├── locales/                 # 다국어 번역
│   ├── ko/
│   │   └── common.json
│   └── en/
│       └── common.json
│
├── functions/               # Firebase Cloud Functions
│   ├── src/
│   │   ├── crawl.ts        # 크롤링 스케줄러
│   │   ├── newsletter.ts   # 뉴스레터 발송
│   │   └── index.ts
│   └── package.json
│
├── types/                   # TypeScript 타입
│   └── firestore.ts        # Firestore 스키마
│
├── styles/                  # 스타일
│   └── globals.css
│
├── .env.example             # 환경 변수 예시
├── next.config.js           # Next.js 설정
├── tailwind.config.ts       # Tailwind 설정
├── tsconfig.json            # TypeScript 설정
└── package.json
```

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <your-repo-url>
cd ai-edu-news
```

### 2. 환경 변수 설정

`.env.example`을 `.env`로 복사하고 값을 입력하세요:

```bash
cp .env.example .env
```

**필수 환경 변수:**
- `XAI_API_KEY`: xAI Grok API 키
- `NEXT_PUBLIC_FIREBASE_*`: Firebase 프로젝트 설정
- `FIREBASE_ADMIN_*`: Firebase Admin SDK
- `RESEND_API_KEY`: Resend 이메일 API 키

### 3. 의존성 설치

```bash
npm install
```

### 4. Firebase 초기화

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firebase 프로젝트 연결
firebase use --add
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 6. Firebase Functions 배포

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 7. Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

## 📖 사용 방법

### 관리자 워크플로우

1. **뉴스 크롤링**
   ```bash
   # 수동 실행
   npm run crawl

   # 또는 관리자 대시보드에서 "크롤링" 버튼 클릭
   ```

2. **파인만 스타일 생성**
   - `/admin` 접속
   - 오늘의 뉴스 목록에서 원하는 뉴스 선택 (체크박스)
   - "파인만 스타일로 변환" 버튼 클릭
   - 30-60초 대기

3. **편집 및 발행**
   - 생성된 기사를 편집기에서 확인
   - 필요시 수동 편집 (제목, 본문, 질문)
   - "발행" 버튼 클릭
   - 발행 플랫폼 선택 (블로그, Twitter, 뉴스레터)

4. **뉴스레터 발송**
   - 자동: 매주 일요일 오후 8시
   - 수동: `/admin/newsletter`에서 "지금 발송" 클릭

## 🔧 주요 설정

### Vercel Cron (자동 크롤링)

`vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/crawl",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Firebase Functions (뉴스레터)

`functions/src/index.ts`:

```typescript
export const sendWeeklyNewsletter = functions
  .pubsub.schedule('0 20 * * 0') // 매주 일요일 20:00
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    // 뉴스레터 발송 로직
  });
```

## 💰 예상 비용 (월간)

| 서비스 | 무료 티어 | 예상 비용 |
|--------|----------|----------|
| **Vercel** | 100GB 대역폭 | $0 |
| **Firebase** | 50K reads/day | $0 |
| **xAI Grok** | - | $10-20 (90개 기사) |
| **Resend** | 3,000 emails | $0 (1K 구독자) |
| **총계** | - | **$10-20/월** |

구독자 5,000명 기준: **$30-40/월**

## 📚 문서

- [Firebase 설정 가이드](docs/firebase-setup.md)
- [xAI Grok API 사용법](docs/grok-api.md)
- [크롤러 커스터마이징](docs/crawler-custom.md)
- [뉴스레터 템플릿 수정](docs/newsletter-template.md)

## 🤝 기여

이 프로젝트는 개인 프로젝트이지만 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 👤 제작자

**[Your Name]**
- 교사 & AI 유튜버
- 🌐 Website: [your-website.com](https://your-website.com)
- 📧 Email: your-email@example.com
- 🐦 Twitter: [@your-handle](https://twitter.com/your-handle)

## 🙏 감사의 말

- [TrendRadar](https://github.com/sansan0/TrendRadar) - 크롤링 인프라 참고
- [xAI](https://x.ai/) - Grok API 제공
- [Vercel](https://vercel.com/) - 호스팅
- [Firebase](https://firebase.google.com/) - 백엔드
- [Richard Feynman](https://en.wikipedia.org/wiki/Richard_Feynman) - 영감

---

Made with ❤️ and ☕ by [Your Name]
