# woojuLib 디자인 시스템

> 가족이 함께 사용하는 따뜻하고 직관적인 독서 플랫폼을 위한 디자인 가이드라인

## 1. 디자인 철학 (Design Philosophy)

### 1.1 핵심 가치
- **따뜻함 (Warmth)**: 가족의 정서적 유대를 표현하는 부드럽고 포근한 색감
- **직관성 (Intuitive)**: 8세 우주부터 42세 호섭까지 모두가 쉽게 사용
- **접근성 (Accessibility)**: 어린이와 기술 능숙도가 낮은 사용자도 고려
- **즐거움 (Delight)**: 독서를 게임처럼 즐겁게 만드는 인터랙션

### 1.2 디자인 원칙
1. **큰 터치 영역**: 최소 44x44px (어린이와 어르신을 위함)
2. **명확한 위계**: 정보의 우선순위가 시각적으로 명확
3. **일관성**: 모든 페이지에서 동일한 패턴 사용
4. **피드백**: 모든 액션에 즉각적인 시각적 반응
5. **친근한 언어**: 딱딱한 용어 대신 가족적인 표현

---

## 2. 컬러 팔레트 (Color Palette)

> Tailwind CSS 컬러 시스템 기준

### 2.1 브랜드 컬러 (Primary)

따뜻한 책의 느낌을 주는 **앰버/오렌지** 계열을 메인으로 사용합니다.

| 용도 | Tailwind 클래스 | HEX | 설명 |
|------|----------------|-----|------|
| Primary 50 | `amber-50` | `#FFFBEB` | 가장 밝은 배경 |
| Primary 100 | `amber-100` | `#FEF3C7` | 호버 배경 |
| Primary 300 | `amber-300` | `#FCD34D` | 보조 강조 |
| **Primary 500** | `amber-500` | `#F59E0B` | **메인 브랜드 컬러** |
| Primary 600 | `amber-600` | `#D97706` | 버튼 호버 |
| Primary 700 | `amber-700` | `#B45309` | 활성 상태 |

### 2.2 보조 컬러 (Secondary)

차분하고 신뢰감을 주는 **틸/그린** 계열을 보조로 사용합니다.

| 용도 | Tailwind 클래스 | HEX | 설명 |
|------|----------------|-----|------|
| Secondary 50 | `teal-50` | `#F0FDFA` | 밝은 배경 |
| Secondary 100 | `teal-100` | `#CCFBF1` | 태그 배경 |
| **Secondary 500** | `teal-500` | `#14B8A6` | **보조 브랜드 컬러** |
| Secondary 600 | `teal-600` | `#0D9488` | 호버 |
| Secondary 700 | `teal-700` | `#0F766E` | 활성 상태 |

### 2.3 가족 구성원별 컬러 (Member Colors)

각 가족 구성원을 구분하기 위한 고유 색상 (아바타, 차트, 활동 피드에 활용)

| 구성원 | Tailwind 클래스 | HEX | 이미지 |
|--------|----------------|-----|--------|
| 샛별 (엄마) | `rose-400` | `#FB7185` | 🌸 |
| 호섭 (아빠) | `blue-500` | `#3B82F6` | 📘 |
| 우주 (아들) | `violet-500` | `#8B5CF6` | 🚀 |
| 유주 (딸) | `pink-400` | `#F472B6` | 🌷 |

### 2.4 시맨틱 컬러 (Semantic)

| 용도 | Tailwind 클래스 | HEX | 사용처 |
|------|----------------|-----|--------|
| Success | `green-500` | `#22C55E` | 목표 달성, 완독 |
| Warning | `yellow-500` | `#EAB308` | 주의, 마감 임박 |
| Error | `red-500` | `#EF4444` | 오류, 삭제 |
| Info | `sky-500` | `#0EA5E9` | 정보, 안내 |

### 2.5 독서 상태 컬러 (Reading Status)

| 상태 | Tailwind 클래스 | HEX | 배지 색상 |
|------|----------------|-----|----------|
| 읽고 싶은 책 | `slate-400` | `#94A3B8` | 회색 |
| 읽는 중 | `amber-500` | `#F59E0B` | 주황 |
| 읽음 (완독) | `green-500` | `#22C55E` | 초록 |
| 중단함 | `red-300` | `#FCA5A5` | 연빨강 |

### 2.6 중립 컬러 (Neutral / Grayscale)

| 용도 | Tailwind 클래스 | HEX |
|------|----------------|-----|
| 본문 텍스트 | `stone-800` | `#292524` |
| 보조 텍스트 | `stone-500` | `#78716C` |
| 비활성 텍스트 | `stone-400` | `#A8A29E` |
| 테두리 | `stone-200` | `#E7E5E4` |
| 배경 (밝음) | `stone-50` | `#FAFAF9` |
| 카드 배경 | `white` | `#FFFFFF` |

> 💡 **참고**: 차가운 `gray` 대신 따뜻한 `stone` 계열을 사용하여 포근한 느낌 강화

### 2.7 다크 모드 (Dark Mode)

| 용도 | Light | Dark |
|------|-------|------|
| 배경 | `stone-50` | `stone-900` |
| 카드 | `white` | `stone-800` |
| 본문 | `stone-800` | `stone-100` |
| 테두리 | `stone-200` | `stone-700` |
| Primary | `amber-500` | `amber-400` |

---

## 3. 타이포그래피 (Typography)

### 3.1 폰트 패밀리

```css
/* 한글 본문 - 가독성 우수 */
--font-sans: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;

/* 제목/강조 - 친근하고 둥근 느낌 */
--font-display: 'Gmarket Sans', 'Pretendard', sans-serif;

/* 숫자/통계 - 명확한 수치 표현 */
--font-mono: 'JetBrains Mono', monospace;
```

**선정 이유:**
- **Pretendard**: 한글 가독성이 뛰어나고 다양한 굵기 제공
- **Gmarket Sans**: 둥글고 친근한 느낌으로 가족 서비스에 적합
- 어린이와 어르신도 읽기 쉬운 명확한 글자 형태

### 3.2 폰트 스케일 (Type Scale)

| 용도 | Tailwind 클래스 | 크기 | 굵기 | 사용처 |
|------|----------------|------|------|--------|
| Display | `text-4xl` | 36px | `font-bold` | 페이지 대표 타이틀 |
| H1 | `text-3xl` | 30px | `font-bold` | 섹션 제목 |
| H2 | `text-2xl` | 24px | `font-semibold` | 카드 제목 |
| H3 | `text-xl` | 20px | `font-semibold` | 소제목 |
| Body Large | `text-lg` | 18px | `font-normal` | 강조 본문 |
| **Body** | `text-base` | 16px | `font-normal` | **기본 본문** |
| Small | `text-sm` | 14px | `font-normal` | 보조 정보 |
| Caption | `text-xs` | 12px | `font-medium` | 라벨, 캡션 |

> 💡 **접근성**: 기본 본문은 최소 16px 이상 유지. 폰트 크기 조절 옵션 제공 (small/normal/large/extra-large)

### 3.3 행간 (Line Height)

| 용도 | Tailwind 클래스 | 값 |
|------|----------------|-----|
| 제목 | `leading-tight` | 1.25 |
| 본문 | `leading-relaxed` | 1.625 |
| 긴 글 (리뷰) | `leading-loose` | 2.0 |

---

## 4. 간격 시스템 (Spacing)

> Tailwind 기본 4px 단위 시스템 사용

| 토큰 | Tailwind | 픽셀 | 사용처 |
|------|----------|------|--------|
| xs | `p-1` / `gap-1` | 4px | 아이콘-텍스트 간격 |
| sm | `p-2` / `gap-2` | 8px | 작은 요소 간격 |
| md | `p-4` / `gap-4` | 16px | 기본 패딩 |
| lg | `p-6` / `gap-6` | 24px | 카드 내부 패딩 |
| xl | `p-8` / `gap-8` | 32px | 섹션 간격 |
| 2xl | `p-12` / `gap-12` | 48px | 페이지 여백 |

---

## 5. 둥글기 & 그림자 (Border Radius & Shadow)

### 5.1 Border Radius

따뜻하고 부드러운 느낌을 위해 둥근 모서리 적극 사용

| 용도 | Tailwind 클래스 | 값 |
|------|----------------|-----|
| 버튼, 인풋 | `rounded-lg` | 8px |
| 카드 | `rounded-2xl` | 16px |
| 큰 카드/모달 | `rounded-3xl` | 24px |
| 아바타, 배지 | `rounded-full` | 원형 |

### 5.2 Shadow

| 용도 | Tailwind 클래스 | 설명 |
|------|----------------|------|
| 카드 기본 | `shadow-sm` | 은은한 그림자 |
| 카드 호버 | `shadow-md` | 살짝 떠오름 |
| 모달, 드롭다운 | `shadow-xl` | 명확한 분리 |
| 강조 요소 | `shadow-amber-200/50` | 컬러 그림자 |

---

## 6. 컴포넌트 디자인 원칙

### 6.1 버튼 (Button)

```
Primary Button
┌────────────────────────┐
│   📖  책 추가하기       │  bg-amber-500, text-white
└────────────────────────┘  rounded-lg, px-6 py-3, font-semibold
                             hover:bg-amber-600

Secondary Button
┌────────────────────────┐
│   취소                 │  bg-stone-100, text-stone-700
└────────────────────────┘  border border-stone-200

Icon Button
┌──────┐
│  ♥   │  rounded-full, p-3, 최소 44x44px
└──────┘
```

**원칙:**
- 최소 높이 44px (터치 영역 확보)
- 주요 액션은 아이콘 + 텍스트 함께 표시
- 명확한 호버/액티브 상태

### 6.2 카드 (Card)

```
┌─────────────────────────────────┐
│  [표지]   책 제목               │  bg-white, rounded-2xl
│  [이미지] 저자 · 출판사         │  shadow-sm, p-6
│           ⭐⭐⭐⭐⭐            │  hover:shadow-md
│           [읽는 중] 배지        │  transition-all
└─────────────────────────────────┘
```

**원칙:**
- 흰 배경 + 둥근 모서리 + 은은한 그림자
- 호버 시 부드러운 상승 효과
- 충분한 내부 여백

### 6.3 배지 (Badge)

```
독서 상태:  [읽는 중]  [완독]  [읽고 싶어요]
장르 태그:  #판타지  #모험  #추리
```

- `rounded-full`, `px-3 py-1`, `text-xs font-medium`
- 상태별 시맨틱 컬러 적용

### 6.4 입력 필드 (Input)

```
라벨
┌─────────────────────────────────┐
│  입력하세요...                  │  border-stone-200
└─────────────────────────────────┘  rounded-lg, px-4 py-3
                                     focus:border-amber-500
도움말 텍스트                        focus:ring-2 ring-amber-200
```

**원칙:**
- 명확한 라벨 항상 표시
- 포커스 시 컬러 강조
- 에러 시 빨간 테두리 + 메시지

### 6.5 아바타 (Avatar)

```
구성원별 컬러 테두리로 구분

   ┌────┐         샛별   호섭   우주   유주
   │ 🌸 │         🌸     📘     🚀     🌷
   └────┘       rose   blue  violet  pink
  ring-rose-400
```

- `rounded-full`, 구성원 컬러 `ring-2`
- 사이즈: sm(32px), md(40px), lg(56px)

### 6.6 차트 (Chart)

- 가족 구성원별 고유 컬러 일관 적용
- 둥근 막대 (`rounded-t-lg`)
- 부드러운 애니메이션
- 호버 시 툴팁으로 상세 수치

---

## 7. 아이콘 시스템 (Iconography)

### 7.1 아이콘 라이브러리
- **Lucide React** 또는 **Heroicons** 사용
- 일관된 라인 스타일
- 기본 크기 24px, stroke-width 2

### 7.2 주요 아이콘 매핑

| 기능 | 아이콘 | 이모지 대안 |
|------|--------|------------|
| 도서 | `BookOpen` | 📖 |
| 추가 | `Plus` | ➕ |
| 리뷰 | `MessageSquare` | 💬 |
| 좋아요 | `Heart` | ♥ |
| 통계 | `BarChart3` | 📊 |
| 가족 | `Users` | 👨‍👩‍👧‍👦 |
| 추천 | `Sparkles` | ✨ |
| 설정 | `Settings` | ⚙️ |
| 완독 | `CheckCircle` | ✅ |

> 💡 어린이 사용자를 위해 아이콘과 함께 이모지/텍스트 라벨 병행 표시

---

## 8. 인터랙션 & 애니메이션 (Motion)

### 8.1 트랜지션
- 기본: `transition-all duration-200 ease-in-out`
- 부드러운 호버, 색상 변화

### 8.2 마이크로 인터랙션
- **완독 시**: 컨페티 효과 + 축하 애니메이션 🎉
- **좋아요**: 하트 팝 애니메이션
- **목표 달성**: 진행률 바 채워지는 애니메이션
- **페이지 전환**: 부드러운 페이드/슬라이드

### 8.3 라이브러리
- **Framer Motion**: 복잡한 애니메이션
- **Tailwind transition**: 간단한 호버

---

## 9. 반응형 디자인 (Responsive)

### 9.1 브레이크포인트 (Tailwind 기준)

| 디바이스 | Tailwind | 너비 |
|----------|----------|------|
| 모바일 | (기본) | < 640px |
| 태블릿 | `sm:` / `md:` | 640px ~ 1024px |
| 데스크탑 | `lg:` / `xl:` | > 1024px |

### 9.2 모바일 우선 원칙
- 모바일 우선 설계 (가족이 주로 스마트폰 사용)
- 하단 네비게이션 바 (모바일)
- 사이드바 네비게이션 (데스크탑)

---

## 10. 접근성 (Accessibility)

### 10.1 필수 준수 사항
- **색상 대비**: WCAG AA 기준 (4.5:1 이상)
- **키보드 네비게이션**: 모든 기능 키보드로 접근 가능
- **스크린 리더**: 적절한 `aria-label` 제공
- **포커스 표시**: 명확한 포커스 링

### 10.2 가족 맞춤 배려
- **폰트 크기 조절**: 4단계 제공 (호섭, 어르신용)
- **큰 터치 영역**: 어린이(우주, 유주)도 쉽게 탭
- **명확한 아이콘 + 라벨**: 글을 막 배운 어린이 배려

---

## 11. 디자인 토큰 요약 (Tailwind Config)

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F59E0B', // amber-500
          light: '#FCD34D',   // amber-300
          dark: '#D97706',    // amber-600
        },
        secondary: {
          DEFAULT: '#14B8A6', // teal-500
        },
        member: {
          mom: '#FB7185',     // rose-400 (샛별)
          dad: '#3B82F6',     // blue-500 (호섭)
          son: '#8B5CF6',     // violet-500 (우주)
          daughter: '#F472B6',// pink-400 (유주)
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        display: ['Gmarket Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',      // 16px
        button: '0.5rem',  // 8px
      },
    },
  },
}
```

---

**문서 버전**: v1.0  
**작성일**: 2026-06-28  
**디자인 컨셉**: 따뜻한 가족 독서 플랫폼
