# 📰 NewsMorn - AI 기반 뉴스 요약 서비스 [바로가기](https://news-morn.vercel.app/)

<p align="center">
  <img src="./public/demo1.gif" width="75%" />
  <img src="./public/demo3.gif" width="24%" />
</p>

## 프로젝트 개요

- **프로젝트명**: NewsMorn
- **기간**: 2025. 03

**NewsMorn**은 Newsdata API를 통해 다양한 카테고리의 뉴스를 수집하고, **OpenAI API**를 활용해 기사의 내용을 3줄로 요약해주는 **AI 뉴스 요약 웹 애플리케이션**입니다.  
 사용자는 요약된 내용의 기사를 통해 시간을 절약하면서도 주요 이슈를 빠르게 확인할 수 있습니다.

> 프론트엔드 전반을 직접 기획 · 디자인 · 개발한 프로젝트로, API 통신, 서버리스 처리, 다크모드 대응 등 다양한 기술적 도전을 통해 완성도 높은 결과물을 구현했습니다.

### 🧰 Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **API**: OpenAI API, NewsAPI / newsdata.io
- **Deploy**: Vercel
- **UI**: 카드형 리스트, 다크모드/라이트모드, Skeleton UI, 반응형 UI

### ✨ 주요 기능

- 🔍 AI 뉴스 요약 (짧은 요약 / 긴 요약 스타일 선택 가능)
- 📂 카테고리별 뉴스 제공
- 💡 다크모드 / 라이트모드 대응
- ⚙️ 서버리스 API Route를 활용한 뉴스 프록시 처리

---

## 문제 상황 및 해결 과정

### 1. 다크모드 적용 중 `hydration mismatch` 발생

- 문제: SSR 시 `theme` 값이 정의되지 않아 클라이언트와 렌더링 결과 불일치
- 해결: `useSyncExternalStore`를 도입하여 서버와 클라이언트 상태 동기화

### 2. newsdata.io CORS 제한

- 문제: 무료 플랜에서 CORS가 로컬에서만 허용
- 해결: Next.js API Route를 프록시로 사용하여 서버에서 API 호출

### 3. 뉴스 본문 미제공 (content 필드 제한)

- 문제: `content` 필드에 실제 본문이 존재하지 않음
- 해결: description만으로 요약 생성, 프롬프트 설계 조정, description이 없는 경우 요약버튼 숨김처리

### 4. OpenAI 응답 JSON 파싱 오류

- 문제: GPT 응답이 잘리거나 JSON 형식 불완전
- 해결: `JSON.parse()` 전 유효성 검사 및 예외 처리 추가

### 5. 요약 데이터가 페이지에 출력되지 않음

- 문제: 응답 구조 파악 미흡 → 잘못된 데이터 접근
- 해결: 구조 파악 후 정확한 key (`response.summary[0]`)로 수정

### 6. metadata 적용 시 ReactHook과 충돌

- 문제: `use client`를 선언한 컴포넌트에서 metadata를 쓰려고 했음.
- 해결: `use client`선언된 컴포넌트를 분리해주고 기존 페이지에서 metadata 정적생성

---

## 배운 점

- 프론트엔드 SSR과 클라이언트 렌더링의 차이에 대해 이해
- OpenAI API 활용 시 프롬프트 설계와 응답 포맷 안정성 고려의 중요성 체득
- 단독 프로젝트 수행을 통해 전체 흐름을 기획에서 배포까지 경험

---

## 아쉬운 점 & 개선 방향

- 뉴스 본문 크롤링 기능은 배포 환경의 제약으로 미도입
- 향후 사용자 기반 피드백 수집 및 UI 개선이 필요
- 기사 감성 분석 + 짧은요약, 긴 요약 확장성고려

## 🚀 작업 목록

- [x] 다크모드 `hydration mismatch` 문제를 `useSyncExternalStore`로 해결 시도
- [x] `newsdata.io` API를 Next.js API Route를 통해 프록시 처리
- [ ] ~~뉴스 본문 크롤링 기능 추가 (배포서버 한계로 제외됨)~~
- [x] OpenAI 요약기능 수정 - 프롬프트 예시 추가
- [x] 디자인 + UI 수정
- [x] 다크모드/라이트모드 스타일링 개선
- [x] Skeleton UI 기능 추가
- [x] Vercel 배포
- [x] news/route.ts 의 api소진, serviceMaintenance 분기처리 추가
- [x] `metadata` 추가
- [x] vercel `speed-insights` 추가
