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

function AccountGroup({ label, people }: { label: string; people: AccountEntry[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-medium text-neutral-800"
      >
        {label}
        <span
          className={`text-xs text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && <div className="mt-1">{people.map((entry) => (
        <AccountRow key={entry.name} entry={entry} />
      ))}</div>}
    </div>
  );
}

export default function AccountSection() {
  return (
    <section className="bg-white px-6 py-20 text-neutral-900">
      <Reveal className="mb-8 text-center">
        <p className="font-serif text-lg">마음을 전하실 곳</p>
      </Reveal>

      <Reveal className="flex flex-col gap-3">
        <AccountGroup label={accounts.groomSide.label} people={accounts.groomSide.people} />
        <AccountGroup label={accounts.brideSide.label} people={accounts.brideSide.people} />
      </Reveal>
    </section>
  );
}
