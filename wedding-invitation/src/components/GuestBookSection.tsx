"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  addGuestBookEntry,
  deleteGuestBookEntry,
  GuestBookEntry,
  listGuestBookEntries,
} from "@/lib/guestbook";
import { useToast } from "@/context/ToastContext";
import Reveal from "@/components/Reveal";

function formatDate(d: Date | null) {
  if (!d) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function GuestBookSection() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await listGuestBookEntries();
      setEntries(list);
    } catch {
      showToast("방명록을 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim() || !message.trim()) {
      showToast("이름, 비밀번호, 메시지를 모두 입력해주세요");
      return;
    }
    if (password.trim().length < 4) {
      showToast("비밀번호는 4자 이상 입력해주세요");
      return;
    }

    setSubmitting(true);
    try {
      await addGuestBookEntry(name, password, message);
      setName("");
      setPassword("");
      setMessage("");
      showToast("방명록이 등록되었어요");
      await refresh();
    } catch {
      showToast("등록에 실패했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const result = await deleteGuestBookEntry(deleteTargetId, deletePassword);
    if (result === "deleted") {
      showToast("삭제되었습니다");
      setDeleteTargetId(null);
      setDeletePassword("");
      await refresh();
    } else if (result === "wrong-password") {
      showToast("비밀번호가 일치하지 않아요");
    } else {
      showToast("이미 삭제된 메시지예요");
      setDeleteTargetId(null);
    }
  };

  return (
    <section className="px-6 py-20">
      <Reveal className="mb-8 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-400">GUEST BOOK</p>
        <p className="mt-2 font-serif text-lg text-neutral-700">축하의 마음을 남겨주세요</p>
      </Reveal>

      <Reveal>
        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col gap-2 rounded-xl bg-white/70 p-4 shadow-sm"
        >
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              maxLength={20}
              className="w-1/2 rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 (삭제용)"
              type="password"
              maxLength={20}
              className="w-1/2 rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="축하 메시지를 남겨주세요"
            maxLength={300}
            rows={3}
            className="resize-none rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-md bg-accent py-2.5 text-sm font-medium text-neutral-900 transition active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? "등록 중..." : "방명록 남기기"}
          </button>
        </form>
      </Reveal>

      <div className="flex flex-col gap-3">
        {loading && (
          <p className="text-center text-sm text-neutral-400">불러오는 중...</p>
        )}
        {!loading && entries.length === 0 && (
          <p className="text-center text-sm text-neutral-400">
            아직 남겨진 메시지가 없어요. 첫 축하를 남겨보세요!
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl bg-white/70 p-4 shadow-sm"
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="font-medium text-sm text-neutral-800">{entry.name}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-neutral-400">
                  {formatDate(entry.createdAt)}
                </span>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(entry.id)}
                  className="text-[11px] text-neutral-400 underline"
                >
                  삭제
                </button>
              </div>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
              {entry.message}
            </p>
          </div>
        ))}
      </div>

      {deleteTargetId && (
        <div
          className="fixed inset-0 z-[90] mx-auto flex max-w-mobile items-center justify-center bg-black/40 px-8"
          onClick={() => setDeleteTargetId(null)}
        >
          <div
            className="w-full rounded-xl bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-sm text-neutral-700">
              작성 시 입력한 비밀번호를 입력해주세요
            </p>
            <input
              autoFocus
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="mb-3 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTargetId(null);
                  setDeletePassword("");
                }}
                className="flex-1 rounded-md border border-neutral-200 py-2 text-sm text-neutral-600"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-md bg-neutral-800 py-2 text-sm text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
