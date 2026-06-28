# woojuLib 로컬 데이터베이스 설정 가이드

## 📋 목차
1. [사전 요구사항](#사전-요구사항)
2. [Docker 설정](#docker-설정)
3. [Prisma 설정](#prisma-설정)
4. [데이터베이스 초기화](#데이터베이스-초기화)
5. [개발 중 유용한 명령어](#개발-중-유용한-명령어)
6. [트러블슈팅](#트러블슈팅)

---

## 사전 요구사항

### 필수
- **Docker** & **Docker Compose**
  - [설치 가이드](https://docs.docker.com/get-docker/)
  - 설치 확인: `docker --version && docker-compose --version`

- **Node.js** (v18 이상)
  - [설치 가이드](https://nodejs.org/)
  - 설치 확인: `node --version && npm --version`

### 선택사항
- **pgAdmin**: PostgreSQL 웹 관리 도구 (docker-compose에 포함)
- **DBeaver**: PostgreSQL 데스크탑 클라이언트

---

## Docker 설정

### 1단계: Docker Compose 실행

프로젝트 루트에서 다음 명령어를 실행하세요:

```bash
docker-compose up -d
```

이 명령어는 다음 서비스들을 시작합니다:
- **PostgreSQL** (포트: `30306`)
  - 사용자: `root`
  - 비밀번호: `root`
  - 데이터베이스: `woojulib`
- **pgAdmin** (포트: `5050`) - 웹 기반 PostgreSQL 관리 도구
- **Redis** (포트: `6379`) - 캐싱용 (선택사항)

### 2단계: 데이터베이스 연결 확인

```bash
# 데이터베이스 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs postgres
```

### 3단계: 포트 확인

- PostgreSQL: `localhost:30306`
- pgAdmin: `http://localhost:5050`
- Redis: `localhost:6379`

---

## Prisma 설정

### 1단계: Prisma 패키지 설치

```bash
npm install @prisma/client prisma --save-dev
npm install zod ts-node @types/node --save-dev
```

### 2단계: Prisma 초기화

```bash
npx prisma init
```

이 명령어는 `prisma/schema.prisma` 파일을 생성합니다.

### 3단계: 스키마 파일 복사

`docs/schema_draft.prisma` 파일을 `prisma/schema.prisma`에 복사하세요:

```bash
cp docs/schema_draft.prisma prisma/schema.prisma
```

### 4단계: .env.local 확인

`.env.local` 파일이 다음과 같이 설정되었는지 확인하세요:

```bash
DATABASE_URL="postgresql://root:root@localhost:30306/woojulib"
```

---

## 데이터베이스 초기화

### 1단계: 마이그레이션 생성

```bash
npx prisma migrate dev --name init
```

이 명령어는:
1. PostgreSQL 데이터베이스에 테이블 생성
2. Prisma Client 자동 생성
3. migration 파일 생성 (`prisma/migrations/` 디렉토리)

### 2단계: Prisma Studio로 확인 (선택사항)

```bash
npx prisma studio
```

브라우저에서 `http://localhost:5555`로 접속하면 데이터베이스를 시각적으로 확인할 수 있습니다.

### 3단계: 샘플 데이터 추가 (선택사항)

```bash
npx prisma db seed
```

`prisma/seed.ts` 파일에 샘플 데이터를 정의하여 자동 로드 가능합니다.

---

## 개발 중 유용한 명령어

### 데이터베이스

```bash
# Prisma Studio (데이터 시각적 관리)
npx prisma studio

# 마이그레이션 생성
npx prisma migrate dev --name <migration-name>

# 마이그레이션 배포 (프로덕션)
npx prisma migrate deploy

# 스키마 검증
npx prisma validate

# Prisma Client 재생성
npx prisma generate

# 데이터베이스 리셋 (개발 환경에서만!)
npx prisma migrate reset
```

### Docker

```bash
# 서비스 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 서비스 재시작
docker-compose restart

# 로그 확인
docker-compose logs -f postgres

# PostgreSQL 컨테이너 접속
docker-compose exec postgres psql -U root -d woojulib

# Redis 상태 확인
docker-compose exec redis redis-cli ping
```

### PostgreSQL 직접 접속

```bash
# psql로 데이터베이스 접속
psql -h localhost -p 30306 -U root -d woojulib

# 이후 psql 명령어 사용
\dt                    # 테이블 목록
\d <table-name>        # 특정 테이블 스키마
SELECT * FROM users;   # 쿼리 실행
\q                     # 종료
```

### pgAdmin 접속

1. 브라우저에서 `http://localhost:5050` 접속
2. 이메일: `admin@woojulib.local`
3. 비밀번호: `root`
4. 좌측 "Servers" → "Register" → "Server" → 다음 정보 입력:
   - **General**: Name = `woojulib`
   - **Connection**:
     - Hostname: `postgres` (Docker 네트워크 내부 이름)
     - Port: `5432` (컨테이너 내부 포트)
     - Username: `root`
     - Password: `root`
     - Database: `woojulib`

---

## 개발 워크플로우

### 스키마 수정 후 배포

```bash
# 1. prisma/schema.prisma 파일 수정
# 2. 마이그레이션 생성
npx prisma migrate dev --name <description>

# 3. Prisma Client 자동 생성 (위 명령어에 포함됨)
# 4. 코드에서 새로운 모델/필드 사용 가능
```

### 프로덕션 배포 (Vercel)

```bash
# 1. 모든 마이그레이션 확인
npx prisma migrate status

# 2. 프로덕션 DATABASE_URL 설정 (Vercel 대시보드)
# 3. 배포 시 자동으로 마이그레이션 실행
npx prisma migrate deploy
```

---

## 데이터베이스 연결 테스트

### Node.js 스크립트로 테스트

```javascript
// test-db.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ 데이터베이스 연결 성공:', result);
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

실행:
```bash
node test-db.js
```

---

## 트러블슈팅

### 문제: "Cannot connect to database"

**해결책:**
```bash
# 1. Docker 상태 확인
docker-compose ps

# 2. 로그 확인
docker-compose logs postgres

# 3. 포트 충돌 확인
lsof -i :30306  # macOS/Linux
netstat -ano | findstr :30306  # Windows

# 4. 컨테이너 재시작
docker-compose restart postgres
```

### 문제: "Migration failed"

**해결책:**
```bash
# 1. 마이그레이션 상태 확인
npx prisma migrate status

# 2. 마이그레이션 이력 확인
npx prisma migrate history

# 3. 마이그레이션 롤백 (필요시)
npx prisma migrate resolve --rolled-back <migration-name>
```

### 문제: "psql: command not found"

**해결책:**
PostgreSQL이 설치되지 않았습니다. Docker 컨테이너로 접속하세요:
```bash
docker-compose exec postgres psql -U root -d woojulib
```

### 문제: "POSTGRES_USER environment variable not set"

**해결책:**
```bash
# docker-compose.yml 확인
cat docker-compose.yml

# 강제 재생성
docker-compose down -v
docker-compose up -d
```

### 문제: "port 30306 already in use"

**해결책:**

옵션 1: 다른 포트 사용
```bash
# docker-compose.yml 수정
# ports:
#   - "30307:5432"  # 30306 대신 30307 사용
```

옵션 2: 기존 프로세스 종료
```bash
# macOS/Linux
lsof -ti:30306 | xargs kill -9

# Windows
netstat -ano | findstr :30306
taskkill /PID <PID> /F
```

---

## 보안 주의사항

⚠️ **로컬 개발 환경에서만 사용:**
- `.env.local`에 `root:root` 자격증명 사용
- 프로덕션에서는 강력한 비밀번호와 별도 설정 필요

⚠️ **Git에 커밋하면 안 되는 파일:**
```
# .gitignore에 추가됨
.env.local
node_modules/
.env.production
```

---

## 다음 단계

1. ✅ Docker Compose로 데이터베이스 실행
2. ✅ Prisma 마이그레이션 생성
3. ⏭️ Next.js API 라우트 작성
4. ⏭️ React 컴포넌트 개발
5. ⏭️ 인증 (NextAuth.js) 구현

---

**문서 버전**: v1.0  
**작성일**: 2026-06-28  
**마지막 수정**: 2026-06-28
