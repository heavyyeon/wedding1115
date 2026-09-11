# 김진우 ♥ 김수연 모바일 청첩장

Next.js 14 (App Router) + Firebase Firestore 방명록으로 만든 모바일 웨딩 청첩장입니다.

## 1. 로컬에서 실행하기

```bash
npm install
cp .env.example .env.local   # 아래 2번에서 만든 Firebase 값 입력
npm run dev
```

`http://localhost:3000` 에서 확인합니다. (모바일 폭 480px 기준으로 디자인되어 있어, 브라우저 개발자도구의 모바일 화면 모드로 보는 것을 추천합니다.)

## 2. Firebase 프로젝트 설정 (방명록용)

1. [Firebase 콘솔](https://console.firebase.google.com/) 에서 새 프로젝트를 만듭니다.
2. **빌드 > Firestore Database** 에서 데이터베이스를 만듭니다 (프로덕션 모드로 시작해도 됩니다).
3. **Firestore > 규칙** 탭에 이 저장소의 `firestore.rules` 내용을 그대로 붙여넣고 게시합니다.
   - 방명록은 누구나 읽고 쓸 수 있게 열려 있고, 비밀번호는 SHA-256 해시로 저장한 뒤 삭제 시에만 비교합니다.
   - 더 강한 보안이 필요하면(예: 삭제도 서버에서 검증) Firebase Functions 로 확장하는 것을 권장합니다.
4. **프로젝트 설정 > 일반 > 내 앱** 에서 웹 앱을 추가하고, 나오는 설정 값을 `.env.local` (로컬) 과 Vercel 환경변수(배포)에 아래처럼 채워 넣습니다.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 3. 청첩장 내용 채우기

거의 모든 텍스트는 **`src/data/wedding.ts`** 한 파일에 모여 있습니다.

- `couple` — 신랑/신부 이름, 사진 경로
- `wedding` — 날짜/시간/장소/주소 (✅ 이미 입력됨: 2026-11-15 일요일 낮 12:20, 공군호텔 3층 그랜드볼룸홀)
- `invitationText` — 초대 문구 (임시 초안이 들어있어요. 원하시는 문구로 바꿔주세요)
- `accounts` — 신랑측/신부측 계좌 정보 **← [ ] 표시된 부분을 실제 정보로 교체해주세요**
- `directions` — 버스/지하철/자가용 안내, 지도 링크 **← [ ] 표시된 부분을 실제 정보로 교체해주세요**
- `ogMeta` — 카카오톡 공유 시 제목/설명 (이름·날짜 기반으로 자동 생성됨)

## 4. 사진/음원 넣기

`public/` 폴더에 자리표시자 이미지가 미리 채워져 있습니다. 실제 파일로 같은 이름으로 덮어써주세요.
자세한 목록은 `public/README-ASSETS.md` 를 참고하세요.

- `public/main-photo.jpg`, `public/groom.jpg`, `public/bride.jpg`
- `public/invitation.png` (손글씨 이미지)
- `public/kakao.jpg` (카카오톡 공유 썸네일)
- `public/bgm.mp3` (배경음악)
- `public/gallery/1.jpg` ~ `public/gallery/22.jpg`

## 5. Vercel 배포

1. GitHub 등에 이 프로젝트를 올립니다.
2. [Vercel](https://vercel.com/new) 에서 저장소를 import 합니다. (Framework Preset: Next.js — 자동 감지됨)
3. **Environment Variables** 에 위 2번의 `NEXT_PUBLIC_FIREBASE_*` 6개 값을 그대로 등록합니다.
4. Deploy를 누르면 끝입니다. 이후 커스텀 도메인을 연결하려면 Vercel 프로젝트 **Settings > Domains** 에서 추가하세요.

CLI로 배포하는 경우:

```bash
npm i -g vercel
vercel        # 첫 배포 (미리보기)
vercel --prod # 프로덕션 배포
```

## 폴더 구조

```
src/
  app/
    layout.tsx        # 폰트, 카카오 OG 메타, 그레인 오버레이, BGM 버튼
    page.tsx           # 섹션 조립 (Intro → Title → Casting → Invitation → WhenWhere → Gallery → GuestBook → Directions → Account)
    globals.css        # Pretendard, 색상 변수, 그레인/토스트/reveal 스타일
  components/          # 섹션별 컴포넌트
  data/wedding.ts       # 모든 텍스트/정보 (여기만 수정하면 됨)
  lib/
    firebase.ts         # Firebase 초기화
    guestbook.ts         # 방명록 CRUD (Firestore)
    dday.ts              # D-Day 계산
  hooks/useReveal.ts     # 스크롤 진입 감지 (IntersectionObserver)
  context/ToastContext.tsx
firestore.rules          # Firestore 보안 규칙 (Firebase 콘솔에 붙여넣기)
scripts/make_placeholders.py  # 자리표시자 이미지 재생성용 (선택)
```

## 참고: D-Day 계산 방식

시:분을 제외한 자정 기준 날짜 차이로 계산합니다 (`src/lib/dday.ts`).

```js
diff > 0  → "D-N"
diff === 0 → "D-Day"
diff < 0  → "D+N"
```
