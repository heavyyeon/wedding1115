"use client";

import { useState } from "react";
import { accounts, type AccountEntry } from "@/data/wedding";
import { useToast } from "@/context/ToastContext";
import Reveal from "@/components/Reveal";

function AccountRow({ entry }: { entry: AccountEntry }) {
  const { showToast } = useToast();

  const copy = async () => {
    try {
      // 복사 버튼은 은행명 없이 계좌번호 숫자만 복사되게 합니다.
      // (송금 앱에 붙여넣을 때 계좌번호만 바로 입력되도록)
      await navigator.clipboard.writeText(entry.number);
      showToast("계좌번호가 복사되었어요");
    } catch {
      showToast("복사에 실패했어요");
    }
  };

  return (
    <div className="border-t border-white/10 py-4 first:border-t-0">
      <p className="text-sm font-semibold text-white">{entry.name}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-white/90">
            {entry.bank} {entry.number}
          </p>
          <p className="text-xs text-white/50">{entry.holder}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-medium text-white/90 active:scale-95"
          >
            복사
          </button>
          {entry.kakaopayLink && (
            <a
              href={entry.kakaopayLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#fee500] px-3 py-1.5 text-xs font-medium text-neutral-900 active:scale-95"
            >
              pay
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// 토글 제목 줄(신랑측/신부측)에 입히는 색상입니다. 색을 바꾸고 싶으면 여기 클래스만 수정하세요.
// 바탕이 검정이라서 연핑크/흰색 제목 줄에는 진한 글씨를 맞췄습니다.
const TONES = {
  pink: {
    header: "bg-rose-200 text-neutral-900",
    arrow: "text-neutral-700",
    border: "border-rose-200",
  },
  white: {
    header: "bg-white text-neutral-900",
    arrow: "text-neutral-700",
    border: "border-white",
  },
} as const;

function AccountGroup({
  label,
  people,
  tone,
}: {
  label: string;
  people: AccountEntry[];
  tone: keyof typeof TONES;
}) {
  const [open, setOpen] = useState(false);
  const t = TONES[tone];

  return (
    <div className={`overflow-hidden rounded-xl border bg-neutral-900 ${t.border}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium ${t.header}`}
      >
        {label}
        <span className={`text-xs transition-transform ${t.arrow} ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-1">
          {people.map((entry) => (
            <AccountRow key={entry.name} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountSection() {
  return (
    // 위쪽 여백(오시는 길과의 간격)은 원래대로 되돌렸습니다(pt-20). 아래쪽도 pb-20 입니다.
    // 바탕은 검정(bg-black), 글씨는 흰색입니다.
    <section className="bg-black px-6 pb-20 pt-20 text-white">
      <Reveal className="mb-8 text-center">
        <p className="font-serif text-lg">마음을 전하실 곳</p>
      </Reveal>

      <Reveal className="flex flex-col gap-3">
        <AccountGroup label={accounts.groomSide.label} people={accounts.groomSide.people} tone="pink" />
        <AccountGroup label={accounts.brideSide.label} people={accounts.brideSide.people} tone="white" />
      </Reveal>
    </section>
  );
}
