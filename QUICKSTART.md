# 🚀 woojuLib 빠른 시작 가이드

## 📦 1단계: 프로젝트 초기화

### 1.1 필수 패키지 설치

```bash
npm install
```

### 1.2 Prisma 설치

```bash
npm install @prisma/client prisma --save-dev
npm install zod ts-node @types/node --save-dev
```

### 1.3 package.json에 스크립트 추가

`package.json`의 `"scripts"` 섹션에 다음을 추가하세요:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:up": "docker-compose up -d",
    "db:down": "docker-compose down",
    "db:logs": "docker-compose logs -f postgres",
    "db:reset": "prisma migrate reset",
    "db:seed": "prisma db seed",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "prisma:migrate": "prisma migrate dev",
    "prisma:push": "prisma db push",
    "prisma:validate": "prisma validate",
    "test": "jest",
    "test:watch": "jest --watch",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🗄️ 2단계: 데이터베이스 설정

### 2.1 Docker 실행

```bash
npm run db:up
```

또는:

```bash
docker-compose up -d
```

**확인:**
```bash
docker-compose ps
```

예상 출력:
```
NAME                    STATUS
woojulib-postgres       Up (healthy)
woojulib-pgadmin        Up
woojulib-redis          Up
```

### 2.2 Prisma 스키마 복사

```bash
cp docs/schema_draft.prisma prisma/schema.prisma
```

### 2.3 Prisma 마이그레이션

```bash
npm run prisma:migrate
```

또는 직접:

```bash
npx prisma migrate dev --name init
```

**이 명령어는:**
- ✅ PostgreSQL 테이블 생성
- ✅ Prisma Client 자동 생성
- ✅ Migration 파일 생성

### 2.4 데이터베이스 확인

```bash
# Prisma Studio (웹 UI)
npm run prisma:studio
```

브라우저: `http://localhost:5555`

---

## ⚙️ 3단계: 개발 환경 설정

### 3.1 환경 변수 확인

`.env.local` 파일이 다음과 같은지 확인:

```bash
DATABASE_URL="postgresql://root:root@localhost:30306/woojulib"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3.2 필요한 패키지 설치

```bash
# Next.js 기본
npm install next react react-dom

# 상태 관리
npm install zustand

# 데이터 페칭
npm install @tanstack/react-query

# 폼 관리
npm install react-hook-form zod

# UI
npm install tailwindcss postcss autoprefixer daisyui
npx tailwindcss init -p

# 인증
npm install next-auth

# 유틸
npm install clsx date-fns axios
```

---

## 🧑‍💻 4단계: 개발 서버 시작

```bash
npm run dev
```

브라우저: `http://localhost:3000`

---

## 📚 유용한 명령어

### 데이터베이스

```bash
# Prisma Studio 실행
npm run prisma:studio

# 마이그레이션 상태 확인
npx prisma migrate status

# 데이터베이스 리셋 (개발용, 모든 데이터 삭제!)
npm run db:reset

# Docker 로그 확인
npm run db:logs

# 데이터베이스 중지
npm run db:down
```

### 개발

```bash
# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 테스트
npm run test

# 테스트 감시 모드
npm run test:watch
```

---

## 🔗 포트 정보

| 서비스 | 포트 | 주소 |
|--------|------|------|
| Next.js | 3000 | http://localhost:3000 |
| PostgreSQL | 30306 | localhost:30306 |
| pgAdmin | 5050 | http://localhost:5050 |
| Redis | 6379 | localhost:6379 |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## 📝 데이터베이스 자격증명

- **호스트**: localhost:30306
- **사용자**: root
- **비밀번호**: root
- **데이터베이스**: woojulib

### pgAdmin 접속

- **URL**: http://localhost:5050
- **이메일**: admin@woojulib.local
- **비밀번호**: root

---

## ✅ 체크리스트

- [ ] Docker & Docker Compose 설치 확인
- [ ] Node.js v18+ 설치 확인
- [ ] `npm install` 완료
- [ ] `npm run db:up` 실행
- [ ] `.env.local` 파일 확인
- [ ] `npm run prisma:migrate` 실행
- [ ] `npm run dev` 서버 시작
- [ ] `http://localhost:3000` 접속 확인

---

## 🆘 문제 해결

### "Cannot connect to database"

```bash
# 1. Docker 상태 확인
docker-compose ps

# 2. 로그 확인
npm run db:logs

# 3. 재시작
docker-compose restart postgres
```

### "Prisma Client not found"

```bash
npm run prisma:generate
```

### "Port 30306 already in use"

```bash
# 다른 프로세스 확인
lsof -i :30306

# 또는 docker-compose.yml에서 포트 변경
```

자세한 내용은 [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)를 참고하세요.

---

## 📖 다음 단계

1. **API 라우트 작성** → `/src/app/api/` 디렉토리
2. **React 컴포넌트** → `/src/components/` 디렉토리
3. **인증 구현** → NextAuth.js
4. **스타일링** → Tailwind CSS + DaisyUI
5. **테스트 작성** → Jest + React Testing Library

---

## 📚 참고 문서

- [PRD.md](./docs/PRD.md) - 제품 요구사항
- [architecture.md](./docs/architecture.md) - 시스템 아키텍처
- [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) - 데이터베이스 상세 가이드

---

**준비 완료! 행운을 빕니다! 🎉**
