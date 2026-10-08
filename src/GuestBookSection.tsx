"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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

// 메모지가 벽에 붙여둔 것처럼 보이도록, 카드마다 아주 살짝씩 다르게 기울입니다.
const TILTS = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

// 카드 폭(px)과 카드 사이 간격(px, gap-4 = 16).
const CARD_W = 260;
const CARD_GAP = 16;
// 첫/마지막 카드가 화면 가운데에 오도록 목록 양끝에 넣는 빈 칸의 너비입니다.
// (padding 의 % 는 바깥 상자 기준이라 어긋나서, 빈 칸 요소를 두는 방식으로 맞췄습니다.)
const EDGE_SPACER = `calc(50% - ${CARD_W / 2 + CARD_GAP}px)`;

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
        stroke="#fb7185"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GuestBookSection() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 처음에는 입력창을 접어두고, "축하 메시지 남기기" 버튼을 누르면 펼칩니다.
  const [formOpen, setFormOpen] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");

  // 옆으로 넘기는 메시지 카드 목록
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

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

  // 삭제 등으로 카드 수가 줄어들었을 때 "현재 번호"가 범위를 벗어나지 않게 맞춥니다.
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, entries.length - 1)));
  }, [entries.length]);

  // 스크롤 위치에서 "화면 가운데에 가장 가까운 카드"를 찾아 현재 번호로 삼습니다.
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.querySelectorAll<HTMLElement>("[data-card]")).forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setCurrent(best);
  };

  // 화살표 버튼(PC) / 번호 이동용: 해당 번호의 카드를 화면 가운데로 부드럽게 가져옵니다.
  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const target = Math.max(0, Math.min(entries.length - 1, index));
    const card = el.querySelectorAll<HTMLElement>("[data-card]")[target];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

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
      setFormOpen(false);
      await refresh();
      // 방금 남긴 메시지가 맨 앞(가장 최신)이라, 첫 카드로 돌아가서 보여줍니다.
      trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
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
    // 다른 섹션과 간격을 맞추기 위해 위/아래 여백을 py-10으로 했습니다.
    <section className="px-6 py-10">
      <Reveal className="mb-6 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-400">GUEST BOOK</p>
        <p className="mt-2 font-serif text-lg text-neutral-700">축하의 마음을 남겨주세요</p>
      </Reveal>

      {/* ── 메시지 남기기: 버튼을 누르면 입력창이 부드럽게 펼쳐집니다 ── */}
      <Reveal className="mb-4">
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="mx-auto flex items-center gap-2 rounded-full border border-rose-300 px-6 py-2.5 text-sm text-rose-400 transition active:scale-95"
        >
          {formOpen ? "닫기" : "축하 메시지 남기기"}
          <span
            className={`inline-block h-2 w-2 border-b border-r border-rose-400 transition-transform ${
              formOpen ? "mt-1 -rotate-[135deg]" : "mb-1 rotate-45"
            }`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows,visibility] duration-500 ease-in-out ${
            formOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4"
            >
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  maxLength={20}
                  className="w-1/2 rounded-md border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 (삭제용)"
                  type="password"
                  maxLength={20}
                  className="w-1/2 rounded-md border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300"
                />
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="축하 메시지를 남겨주세요"
                maxLength={300}
                rows={3}
                className="resize-none rounded-md border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300"
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-1 rounded-md bg-rose-300 py-2.5 text-sm font-medium text-white transition active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? "등록 중..." : "방명록 남기기"}
              </button>
            </form>
          </div>
        </div>
      </Reveal>

      {/* ── 메시지 목록: 메모지 카드를 옆으로 넘겨서 봅니다 ── */}
      {loading && <p className="text-center text-sm text-neutral-400">불러오는 중...</p>}

      {!loading && entries.length === 0 && (
        <p className="rounded-xl border border-dashed border-rose-200 py-8 text-center text-sm font-light text-neutral-400">
          아직 남겨진 메시지가 없어요.
          <br />첫 축하를 남겨보세요!
        </p>
      )}

      {entries.length > 0 && (
        <>
          <div
            ref={trackRef}
            onScroll={onScroll}
            // -mx-6: 섹션 좌우 여백을 뚫고 화면 끝까지 넓혀서, 옆 카드가 살짝 보이게 합니다.
            className="relative -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div aria-hidden="true" className="shrink-0" style={{ width: EDGE_SPACER }} />
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                data-card
                className={`relative shrink-0 snap-center ${TILTS[i % TILTS.length]}`}
                style={{ width: CARD_W }}
              >
                {/* 마스킹테이프 */}
                <span className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-2 bg-rose-300/60" />

                <div className="flex h-full min-h-[190px] flex-col rounded-sm bg-rose-100 px-5 pb-4 pt-6 shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-800">
                      <HeartIcon />
                      {entry.name}
                    </p>
                    {/* 우표 느낌의 날짜 */}
                    <span className="border border-dashed border-rose-300 px-1.5 py-0.5 font-mono text-[10px] text-rose-400">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>

                  <p className="mt-3 flex-1 whitespace-pre-line break-words text-[13px] font-light leading-6 text-neutral-700">
                    {entry.message}
                  </p>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(entry.id)}
                    className="mt-3 self-end text-[11px] text-neutral-400 underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            <div aria-hidden="true" className="shrink-0" style={{ width: EDGE_SPACER }} />
          </div>

          {/* 몇 번째 메시지인지 + 좌우 이동 버튼(마우스 사용하는 PC에서도 넘길 수 있게) */}
          <div className="flex items-center justify-center gap-5 text-neutral-500">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              aria-label="이전 메시지"
              className="flex h-9 w-9 items-center justify-center text-2xl transition active:scale-90 disabled:opacity-25"
            >
              ‹
            </button>
            <span className="font-mono text-xs tracking-widest">
              {current + 1} / {entries.length}
            </span>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              disabled={current >= entries.length - 1}
              aria-label="다음 메시지"
              className="flex h-9 w-9 items-center justify-center text-2xl transition active:scale-90 disabled:opacity-25"
            >
              ›
            </button>
          </div>
        </>
      )}

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
              className="mb-3 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
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
