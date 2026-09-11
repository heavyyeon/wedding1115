import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "guestbook";

export type GuestBookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: Date | null;
};

/**
 * 비밀번호는 Firestore 보안 규칙만으로는 서버 검증이 불가능하므로(별도 Cloud Function 없이는),
 * 최소한의 보호를 위해 SHA-256 해시로 저장하고 삭제 시 같은 해시로만 비교합니다.
 * 완전한 보안이 필요하다면 Firebase Functions로 검증 로직을 옮기는 것을 권장합니다.
 */
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function addGuestBookEntry(
  name: string,
  password: string,
  message: string
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await addDoc(collection(db, COLLECTION), {
    name: name.trim(),
    password: passwordHash,
    message: message.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function listGuestBookEntries(): Promise<GuestBookEntry[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data() as {
      name: string;
      message: string;
      createdAt: Timestamp | null;
    };
    return {
      id: d.id,
      name: data.name,
      message: data.message,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
    };
  });
}

/**
 * 삭제 시점에만 해당 문서의 비밀번호 해시를 조회해 비교합니다.
 * (목록 조회 결과에는 비밀번호 필드를 담지 않아, 화면에는 노출되지 않습니다.)
 */
export async function deleteGuestBookEntry(
  id: string,
  password: string
): Promise<"deleted" | "wrong-password" | "not-found"> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return "not-found";

  const storedHash = (snap.data() as { password: string }).password;
  const attemptHash = await hashPassword(password);
  if (attemptHash !== storedHash) return "wrong-password";

  await deleteDoc(ref);
  return "deleted";
}

export { hashPassword };
