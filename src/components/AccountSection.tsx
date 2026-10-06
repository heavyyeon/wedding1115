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
    <div className="border-t border-neutral-100 py-4 first:border-t-0">
      <p className="text-sm font-semibold text-neutral-800">{entry.name}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-neutral-700">
            {entry.bank} {entry.number}
          </p>
          <p className="text-xs text-neutral-400">{entry.holder}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 active:scale-95"
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
// (노란 배경 위에는 흰 글씨가 잘 안 보여서 노란색은 진한 글씨로 맞췄습니다.)
const TONES = {
  pink: {
    header: "bg-rose-300 text-white",
    arrow: "text-white/80",
    border: "border-rose-200",
  },
  yellow: {
    header: "bg-yellow-300 text-neutral-900",
    arrow: "text-neutral-700",
    border: "border-yellow-200",
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
    <div className={`overflow-hidden rounded-xl border bg-white shadow-sm ${t.border}`}>
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
    // 위쪽 여백(오시는 길과의 간격)은 절반으로 줄였고(pt-10), 아래쪽은 그대로입니다(pb-20).
    <section className="bg-white px-6 pb-20 pt-10 text-neutral-900">
      <Reveal className="mb-8 text-center">
        <p className="font-serif text-lg">마음을 전하실 곳</p>
      </Reveal>

      <Reveal className="flex flex-col gap-3">
        <AccountGroup label={accounts.groomSide.label} people={accounts.groomSide.people} tone="pink" />
        <AccountGroup label={accounts.brideSide.label} people={accounts.brideSide.people} tone="yellow" />
      </Reveal>
    </section>
  );
}
