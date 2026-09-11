"use client";

import { useState } from "react";
import { accounts } from "@/data/wedding";
import { useToast } from "@/context/ToastContext";
import Reveal from "@/components/Reveal";

type AccountRow = (typeof accounts)[keyof typeof accounts];

function AccountCard({ account }: { account: AccountRow }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${account.bank} ${account.number}`);
      showToast("계좌번호가 복사되었어요");
    } catch {
      showToast("복사에 실패했어요");
    }
  };

  return (
    <div className="rounded-xl bg-white/80 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-medium text-neutral-800"
      >
        {account.label}
        <span className="text-xs text-neutral-400">{open ? "접기" : "펼치기"}</span>
      </button>

      {open && (
        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
          <div>
            <p className="text-sm text-neutral-700">
              {account.bank} {account.number}
            </p>
            <p className="text-xs text-neutral-400">{account.holder}</p>
          </div>
          <button
            type="button"
            onClick={copy}
            className="rounded-full border border-neutral-800/20 px-3 py-1.5 text-xs font-medium text-neutral-800"
          >
            복사
          </button>
        </div>
      )}
    </div>
  );
}

export default function AccountSection() {
  return (
    <section className="bg-accent px-6 py-20 text-neutral-900">
      <Reveal className="mb-8 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-800/70">
          FOR YOUR HEART
        </p>
        <p className="mt-2 font-serif text-lg">마음을 전하실 곳</p>
      </Reveal>

      <Reveal className="flex flex-col gap-3">
        <AccountCard account={accounts.groomSide} />
        <AccountCard account={accounts.brideSide} />
      </Reveal>
    </section>
  );
}
