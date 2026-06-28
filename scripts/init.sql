-- woojuLib 초기화 스크립트
-- PostgreSQL 16 이상

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 데이터베이스 생성 (docker-compose에서 이미 생성됨)
-- 추가 초기화 작업은 여기에 입력

-- 인덱스 생성을 위한 기본 설정
SET default_transaction_isolation = 'read committed';

-- UTF-8 인코딩 확인
SELECT datname, pg_encoding_to_char(encoding)
FROM pg_database
WHERE datname = 'woojulib';
