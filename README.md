This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# NewsMorn

## 1. 다크모드 적용 중 Hydration Mismatch 문제

### 🔍 문제 발생 원인

- `next-themes`로 다크모드를 적용하면서 `hydration mismatch` 오류 발생.
- `layout.tsx`에서 `ThemeProvider`를 감싸고 있지만, 서버에서 `class="dark"` 여부를 모름.
- `useTheme()`가 서버에서 실행될 경우, 클라이언트와 다르게 동작할 가능성이 있음.
- **초기 렌더링 시 `theme`가 `undefined`일 수 있음 → hydration mismatch 발생 가능성 증가.**

### ✅ 해결 과정

처음에는 `useEffect`를 활용하여 클라이언트에서 다크모드 적용 후 `hydration`이 이루어지도록 수정했으나, 프로젝트를 재실행할 때 문제가 다시 발생.

#### 🚀 시도한 해결 방법

- `suppressHydrationWarning` 적용 → 하지만 텍스트 요소에서만 가능.
- [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore#usesyncexternalstore) 훅을 활용하는 방법이 있음.

🔗 참고: [Hydration Mismatch를 useEffect 없이 해결하기](https://medium.com/@jiwoochoics/%EC%96%B4%EC%A9%94-%EC%88%98-%EC%97%86%EB%8A%94-hydration-mismatch%EB%A5%BC-useeffect%EC%97%86%EC%9D%B4-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0-c984c9120f9b)

---

## 2. `newsdata.io` Free Plan의 한계

### ❌ 제한 사항

- `free plan`에서는 **로컬호스트에서만 CORS 활성화됨.**
- 기존 클라이언트에서 `util/fetchNews`를 통해 직접 API 요청을 보냈지만, CORS 문제 발생.

### ✅ 해결 방법

- Next.js API Route(`/api/news`)를 사용하여 **서버에서 `newsdata.io` API를 호출.**
- 클라이언트에서는 Next.js API(`/api/news`)를 호출하여 데이터를 가져오도록 변경.
- **Vercel 배포 이후 정상 동작하는지 확인 필요.**

---

## 3. `newsdata.io` Free Plan의 `content` 제공 불가 문제

### ❌ 제한 사항

- API에서 제공하는 JSON 데이터에서 `content` 필드 값이 `"ONLY AVAILABLE IN PAID PLANS"`로 표시됨.

### ✅ 해결 아이디어

**해결 방법 1:**

- `newsdata.io`에서 제공하는 `link`(기사 원문 URL)를 사용하여 직접 본문을 가져오기.
- AI 요약을 생성할 때 원문을 크롤링하여 텍스트 데이터를 확보 후 요약.

**해결 방법 2:**

- `newsdata.io`에서 제공하는 description만을 사용하여 ai로 정리하여 제공

---

## 🚀 다음 작업 예정

- [x] 다크모드 `hydration mismatch` 문제를 `useSyncExternalStore`로 해결 시도.
- [x] `newsdata.io` API를 Next.js API Route를 통해 프록시 처리.
- [ ] ~~뉴스 본문 크롤링 기능을 추가하여 유료 플랜 없이도 요약 기능 제공 가능하도록 개선~~ 배포서버의 한계
- [ ] OpenAI 요약기능 수정
- [ ] 디자인 수정
- [ ] Darkmode, Lightmode 수정
- [ ] Skeleton UI 기능 추가
- [ ] Deploy
