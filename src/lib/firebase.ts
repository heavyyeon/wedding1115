import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 웹 앱 연결 값입니다. 이 값들은 비밀번호가 아니라 "어느 Firebase 프로젝트에 연결할지"를
// 알려주는 공개용 주소 같은 것이라 브라우저 코드에 그대로 들어가도 괜찮습니다 (Firebase 공식 안내도
// 동일). 실제 접근 제한은 Firebase 콘솔의 Firestore "규칙"이 담당합니다.
// Vercel 환경변수 저장 화면이 NEXT_PUBLIC_ 이름을 막아서, 환경변수 대신 코드에 직접 넣었습니다.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA2yL1VU3TSnp2NgHZW0iZqAzFHAUaUDEs",
  authDomain: "wedding1115-ef1a7.firebaseapp.com",
  projectId: "wedding1115-ef1a7",
  storageBucket: "wedding1115-ef1a7.firebasestorage.app",
  messagingSenderId: "78058100055",
  appId: "1:78058100055:web:bf3dd3d850292bd8355a12",
};

// Next.js는 dev 모드에서 모듈을 여러 번 재평가할 수 있어 getApps()로 중복 초기화를 방지합니다.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
