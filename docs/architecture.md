# woojuLib 시스템 아키텍처 및 데이터 설계

## 1. 전체 시스템 아키텍처

### 1.1 3계층 아키텍처 (3-Tier Architecture)

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│         (Next.js App Router + React Components)     │
│  - Pages: /app/page.tsx, /app/dashboard, etc.       │
│  - Components: UI 컴포넌트들 (/components)          │
│  - Hooks: 커스텀 React Hooks (/hooks)               │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
         ▼                            ▼
┌──────────────────────┐    ┌────────────────────────┐
│  Client-side Logic   │    │  API Routes            │
│  - State (Zustand)   │    │  (/app/api/)           │
│  - Queries (TQuery)  │    │  - REST endpoints      │
│  - Hooks             │    │  - Auth handlers       │
└──────────────────────┘    └────────┬───────────────┘
                                     │
                    ┌────────────────┴──────────────────┐
                    │                                   │
                    ▼                                   ▼
         ┌──────────────────────────┐     ┌──────────────────────┐
         │   Business Logic Layer   │     │  External Services   │
         │  (/lib, /services)       │     │  - Google Books API  │
         │  - 추천 알고리즘          │     │  - Naver Books API   │
         │  - 통계 계산             │     │  - AI 서비스         │
         │  - 유효성 검증           │     │  - Auth (NextAuth)   │
         └──────────┬───────────────┘     └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │   Data Access Layer      │
         │  (Prisma ORM)            │
         │  - Queries               │
         │  - Mutations             │
         │  - Transactions          │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │  Database Layer          │
         │  - PostgreSQL            │
         │  - Redis (캐싱)          │
         └──────────────────────────┘
```

### 1.2 데이터 흐름 (User Journey)

```
1. 인증 (Authentication)
   User Sign-up/Login → NextAuth.js → JWT Token → Secure Session

2. 가족 관리 (Family Management)
   Create Family → Invite Members → Manage Roles/Permissions

3. 독서 활동 (Reading Activity)
   Add Book → Track Reading Progress → Write Review → Share with Family

4. AI 추천 (Recommendation Engine)
   User Reading History → Analyze Preferences → ML Model → Recommend Books

5. 커뮤니티 (Community Engagement)
   View Reviews → Comment → Like → Family Timeline

6. 통계 분석 (Analytics)
   Aggregate Reading Data → Calculate Stats → Display Dashboard
```

---

## 2. 폴더 구조 (Project Structure)

```
woojuLib/
├── docs/                          # 문서
│   ├── PRD.md                    # 제품 요구사항
│   ├── architecture.md           # 이 파일
│   └── schema_draft.prisma       # 데이터베이스 스키마
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # 홈페이지
│   │   ├── (auth)/               # 인증 관련 페이지 (그룹화)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/          # 대시보드 페이지 (보호됨)
│   │   │   ├── page.tsx          # 홈 대시보드
│   │   │   ├── books/page.tsx    # 도서 목록
│   │   │   ├── my-library/page.tsx
│   │   │   ├── statistics/page.tsx
│   │   │   ├── family/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   └── layout.tsx        # 대시보드 레이아웃
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth].ts
│   │   │   │   └── register.ts
│   │   │   ├── books/
│   │   │   │   ├── route.ts      # GET /api/books, POST /api/books
│   │   │   │   └── [id]/route.ts # GET /api/books/[id]
│   │   │   ├── reading-logs/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── reviews/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── comments/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── recommendations/
│   │   │   │   └── route.ts
│   │   │   ├── family/
│   │   │   │   ├── route.ts
│   │   │   │   ├── members/route.ts
│   │   │   │   └── statistics/route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── settings/
│   │   │       ├── profile/route.ts
│   │   │       └── preferences/route.ts
│   │   └── middleware.ts         # 미들웨어 (인증 확인)
│   │
│   ├── components/               # React 컴포넌트
│   │   ├── common/              # 공통 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth/                # 인증 관련 컴포넌트
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── books/               # 도서 관련 컴포넌트
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookSearch.tsx
│   │   │   ├── BookDetail.tsx
│   │   │   └── BookForm.tsx
│   │   ├── reading-log/         # 독서 기록 컴포넌트
│   │   │   ├── ReadingLogForm.tsx
│   │   │   ├── ReadingLogList.tsx
│   │   │   └── ProgressTracker.tsx
│   │   ├── review/              # 리뷰 관련 컴포넌트
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   └── ReviewList.tsx
│   │   ├── family/              # 가족 관련 컴포넌트
│   │   │   ├── FamilyList.tsx
│   │   │   ├── FamilyInvite.tsx
│   │   │   ├── MemberCard.tsx
│   │   │   └── FamilyStats.tsx
│   │   ├── dashboard/           # 대시보드 컴포넌트
│   │   │   ├── StatCard.tsx
│   │   │   ├── Chart.tsx
│   │   │   ├── Timeline.tsx
│   │   │   └── RecommendationCarousel.tsx
│   │   └── settings/            # 설정 컴포넌트
│   │       ├── ProfileSettings.tsx
│   │       ├── PreferenceSettings.tsx
│   │       ├── NotificationSettings.tsx
│   │       └── PrivacySettings.tsx
│   │
│   ├── lib/                     # 유틸리티 및 헬퍼 함수
│   │   ├── prisma.ts           # Prisma 클라이언트 싱글톤
│   │   ├── auth.ts             # 인증 관련 유틸
│   │   ├── validation.ts       # 입력 검증
│   │   ├── constants.ts        # 상수 정의
│   │   └── utils.ts            # 일반 유틸리티
│   │
│   ├── services/               # 비즈니스 로직
│   │   ├── user.service.ts
│   │   ├── family.service.ts
│   │   ├── book.service.ts
│   │   ├── reading-log.service.ts
│   │   ├── review.service.ts
│   │   ├── recommendation.service.ts
│   │   ├── statistics.service.ts
│   │   └── external-api.service.ts
│   │
│   ├── hooks/                  # 커스텀 React Hooks
│   │   ├── useAuth.ts
│   │   ├── useFamily.ts
│   │   ├── useBooks.ts
│   │   ├── useReadingLog.ts
│   │   ├── useReviews.ts
│   │   └── useStatistics.ts
│   │
│   ├── types/                  # TypeScript 타입 정의
│   │   ├── index.ts            # 메인 타입 export
│   │   ├── user.ts
│   │   ├── family.ts
│   │   ├── book.ts
│   │   ├── reading-log.ts
│   │   ├── review.ts
│   │   └── api.ts
│   │
│   ├── styles/                 # 글로벌 스타일
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   └── config/                 # 설정
│       ├── site.config.ts
│       └── api.config.ts
│
├── prisma/
│   ├── schema.prisma          # Prisma 스키마
│   └── seed.ts                # 데이터베이스 시드 (초기 데이터)
│
├── public/                    # 정적 파일
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                     # 테스트
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                # 로컬 환경 변수
├── .env.example              # 환경 변수 예시
├── .env.production           # 프로덕션 환경 변수
├── next.config.ts            # Next.js 설정
├── tailwind.config.ts        # Tailwind CSS 설정
├── tsconfig.json             # TypeScript 설정
├── package.json              # 패키지 정의
├── package-lock.json         # 패키지 잠금
└── README.md                 # 프로젝트 설명
```

---

## 3. 핵심 데이터 모델 관계도

### 3.1 Entity-Relationship Diagram (개념적)

```
┌─────────────┐
│   Family    │
├─────────────┤
│ id (PK)     │
│ name        │
└────────┬────┘
         │ 1:N
         │
    ┌────▼────┐
    │   User   │
    ├──────────┤
    │ id (PK)  │
    │ familyId │ (FK)
    │ role     │
    └────┬─────┘
         │ 1:N
         │
    ┌────┴────────────────────────────────┬─────────────┐
    │                                     │             │
    ▼                                     ▼             ▼
┌──────────────┐              ┌──────────────────┐  ┌─────────────┐
│ ReadingLog   │              │     Review       │  │ Preference  │
├──────────────┤              ├──────────────────┤  ├─────────────┤
│ id (PK)      │              │ id (PK)          │  │ id (PK)     │
│ userId (FK)  │              │ userId (FK)      │  │ userId (FK) │
│ bookId (FK)  │              │ bookId (FK)      │  │ genres[]    │
│ status       │              │ rating           │  │ goals       │
└────┬────┘       │              │ content          │  └─────────────┘
     │            │              │ hasSpoiler       │
     │            │              └────┬────────────┘
     │            │                   │ 1:N
     │            │                   │
     │            │                   ▼
     │            │              ┌──────────────┐
     │            │              │   Comment    │
     │            │              ├──────────────┤
     │            │              │ id (PK)      │
     │            │              │ reviewId(FK) │
     │            │              │ userId (FK)  │
     │            │              │ content      │
     │            │              └──────────────┘
     │            │
     │            ▼
     │        ┌──────────────┐
     └───────►│     Book     │
              ├──────────────┤
              │ id (PK)      │
              │ title        │
              │ author       │
              │ externalId   │
              └────┬─────────┘
                   │ 1:N
                   │
                   ▼
          ┌──────────────────┐
          │ Recommendation   │
          ├──────────────────┤
          │ id (PK)          │
          │ bookId (FK)      │
          │ recommendedTo(FK)│
          │ recommendedBy(FK)│
          │ reason           │
          └──────────────────┘
```

---

## 4. API 엔드포인트 구조

### 4.1 RESTful API Routes

```
# 인증
POST   /api/auth/register              - 회원가입
POST   /api/auth/login                 - 로그인
POST   /api/auth/logout                - 로그아웃
POST   /api/auth/refresh               - 토큰 갱신
GET    /api/auth/session               - 현재 세션 정보

# 사용자
GET    /api/users/me                   - 현재 사용자 정보
PUT    /api/users/me                   - 현재 사용자 정보 수정
GET    /api/users/:id                  - 특정 사용자 정보
PUT    /api/users/:id/preferences      - 사용자 선호도 수정
GET    /api/users/:id/statistics       - 사용자 통계

# 가족
POST   /api/family                     - 가족 생성
GET    /api/family                     - 내 가족 정보
PUT    /api/family                     - 가족 정보 수정
GET    /api/family/members             - 가족 구성원 목록
POST   /api/family/invite              - 가족 초대
DELETE /api/family/members/:userId     - 가족 멤버 제거
GET    /api/family/statistics          - 가족 통계

# 도서
GET    /api/books                      - 도서 목록 (필터링, 페이징)
POST   /api/books                      - 도서 추가 (수동)
GET    /api/books/:id                  - 도서 상세 정보
PUT    /api/books/:id                  - 도서 정보 수정
DELETE /api/books/:id                  - 도서 삭제
GET    /api/books/search               - 외부 API 도서 검색

# 독서 기록
GET    /api/reading-logs               - 나의 독서 기록
POST   /api/reading-logs               - 독서 기록 생성
GET    /api/reading-logs/:id           - 독서 기록 상세
PUT    /api/reading-logs/:id           - 독서 기록 수정
DELETE /api/reading-logs/:id           - 독서 기록 삭제
PUT    /api/reading-logs/:id/progress  - 읽기 진행률 업데이트

# 리뷰
GET    /api/reviews                    - 리뷰 목록 (필터링)
POST   /api/reviews                    - 리뷰 작성
GET    /api/reviews/:id                - 리뷰 상세
PUT    /api/reviews/:id                - 리뷰 수정
DELETE /api/reviews/:id                - 리뷰 삭제
POST   /api/reviews/:id/like           - 리뷰 좋아요

# 댓글
GET    /api/reviews/:reviewId/comments - 댓글 목록
POST   /api/reviews/:reviewId/comments - 댓글 작성
PUT    /api/comments/:id               - 댓글 수정
DELETE /api/comments/:id               - 댓글 삭제

# 추천
GET    /api/recommendations            - 추천 도서 목록
POST   /api/recommendations            - 도서 추천 (가족 멤버에게)
GET    /api/recommendations/personalized - 개인맞춤 추천

# 설정
GET    /api/settings/profile           - 프로필 설정 조회
PUT    /api/settings/profile           - 프로필 설정 수정
GET    /api/settings/preferences       - 선호도 설정 조회
PUT    /api/settings/preferences       - 선호도 설정 수정
GET    /api/settings/notifications     - 알림 설정 조회
PUT    /api/settings/notifications     - 알림 설정 수정
```

---

## 5. 인증 및 권한 관리

### 5.1 인증 흐름

```
1. Sign Up / Login
   ├─ NextAuth.js 처리
   ├─ Email/Password 또는 OAuth (Google, Apple, Naver, Kakao)
   └─ JWT Token + Refresh Token 생성

2. Protected Routes
   ├─ Middleware.ts에서 토큰 검증
   ├─ 만료된 토큰 자동 갱신
   └─ 로그인 필요 시 /login으로 리다이렉트

3. API Routes
   ├─ req.auth로 현재 사용자 접근 가능
   ├─ Role-based access control (RBAC)
   └─ 리소스 소유권 검증
```

### 5.2 역할 및 권한 (RBAC)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│     Role     │   Parent     │    Child     │    Other     │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Create Family│      ✓       │      ✗       │      ✗       │
│ Invite Member│      ✓       │      ✗       │      ✗       │
│ Remove Member│      ✓       │      ✗       │      ✗       │
│ View Family  │      ✓       │      ✓       │      ✗       │
│ Edit Own Prof│      ✓       │      ✓       │      ✓       │
│ View Stats   │      ✓       │      ✓       │      ✗       │
│ Add Books    │      ✓       │      ✓       │      ✓       │
│ Write Review │      ✓       │      ✓       │      ✓       │
│ Delete Review│   Own Only   │   Own Only   │   Own Only   │
│ Comment      │      ✓       │      ✓       │      ✓       │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 6. 외부 서비스 통합

### 6.1 Book API 통합

```
Client Request
       │
       ▼
┌─────────────────────────────────┐
│   /api/books/search?q=keyword   │
└──────────┬──────────────────────┘
           │
    ┌──────┴──────┬──────────────┬──────────────┐
    │             │              │              │
    ▼             ▼              ▼              ▼
Google Books  Naver Books  Kakao Books  Cache (Redis)
    │             │              │              │
    └─────────────┴──────────────┴──────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  Unified Response│
        │  (Normalized)    │
        └────────┬─────────┘
                 │
                 ▼
            Client (UI)
```

### 6.2 AI 추천 엔진 (향후)

```
사용자 독서 데이터
       │
       ▼
┌────────────────────────────┐
│  /api/recommendations      │
│  (Python FastAPI 호출)     │
└────────────┬───────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
협업필터링      콘텐츠기반
(Collaborative) (Content-based)
    │                 │
    └────────┬────────┘
             │
             ▼
    추천 도서 리스트
```

---

## 7. 캐싱 전략

### 7.1 Redis 캐싱

```
Hot Data (자주 조회되는 데이터)
├─ user:profile:{userId}
├─ family:stats:{familyId}
├─ user:recommendations:{userId}
└─ book:details:{bookId}

Cache Invalidation
├─ 데이터 수정 시 즉시 캐시 삭제
├─ 일정 시간(TTL)이 지나면 자동 만료
└─ 배치 작업으로 주기적 갱신
```

---

## 8. 확장 계획

### Phase 1 (MVP)
- 기본 CRUD 기능
- 가족 관리
- 독서 기록 추적

### Phase 2
- 리뷰 및 댓글
- 기본 통계
- 간단한 추천

### Phase 3
- AI 기반 추천
- 고급 분석
- 모바일 앱

### Phase 4
- 소셜 커뮤니티
- 도서관 연동
- 구독 모델

---

## 9. 성능 최적화 전략

### 9.1 데이터베이스
- 적절한 인덱싱
- 쿼리 최적화
- 배치 작업으로 무거운 계산 처리

### 9.2 캐싱
- Redis 활용
- CDN으로 정적 자산 배포
- 클라이언트 캐싱 헤더 설정

### 9.3 API
- API 응답 시간 < 200ms
- Pagination으로 대량 데이터 처리
- 필드 선택으로 불필요한 데이터 제외

---

## 10. 보안 고려사항

- HTTPS 강제
- CORS 설정
- Rate Limiting
- Input Validation (Zod)
- SQL Injection 방지 (Prisma ORM)
- XSS 방지 (React 자동 escape)
- CSRF 토큰 (NextAuth.js)
- 민감한 정보 환경변수로 관리

---

**문서 버전**: v1.0  
**작성일**: 2026-06-28  
**기술 스택**: Next.js 14 + Prisma + PostgreSQL + Tailwind CSS
