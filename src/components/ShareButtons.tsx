"use client";

import Script from "next/script";
import { ogMeta, share } from "@/data/wedding";
import { useToast } from "@/context/ToastContext";
import Reveal from "@/components/Reveal";

declare global {
  interface Window {
    Kakao?: any;
  }
}

// 클립보드 복사. 카카오톡 앱 안의 브라우저처럼 navigator.clipboard 가 막힌 환경에서도
// 복사가 되도록, 안 될 때는 예전 방식(보이지 않는 입력창 + execCommand)으로 한 번 더 시도합니다.
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 아래 대체 방식으로 계속 진행
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function ShareButtons() {
  const { showToast } = useToast();

  // 공유 순서: ① 카카오 JavaScript 키가 있으면 카카오톡 전용 공유창
  //           ② 없거나 실패하면 휴대폰 기본 공유창(navigator.share) — 여기서 카카오톡 선택 가능
  //           ③ 그것도 안 되는 환경(PC 등)이면 주소를 복사해서 붙여넣도록 안내
  const onKakaoShare = async () => {
    const Kakao = window.Kakao;
    if (share.kakaoJsKey && Kakao?.isInitialized?.()) {
      try {
        // 카카오 "피드" 메시지: 제목·설명·사진·버튼 글자를 wedding.ts 의 문구로 직접 지정합니다.
        const link = { mobileWebUrl: share.siteUrl, webUrl: share.siteUrl };
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: share.kakaoCardTitle,
            description: share.kakaoCardDescription,
            imageUrl: `${share.siteUrl}${ogMeta.imagePath}`,
            imageWidth: 1200,
            imageHeight: 630,
            link,
          },
          buttons: [{ title: share.kakaoCardButton, link }],
        });
        return;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[카카오공유] 전용 공유창 실패, 대체 방식으로 진행합니다:", e);
      }
    }

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: share.kakaoCardTitle,
          text: share.kakaoCardDescription,
          url: share.siteUrl,
        });
        return;
      } catch (e) {
        // 사용자가 공유창을 그냥 닫은 경우는 에러 안내 없이 끝냅니다.
        if ((e as DOMException)?.name === "AbortError") return;
      }
    }

    const ok = await copyText(share.siteUrl);
    showToast(ok ? "주소를 복사했어요. 카톡에 붙여넣어 주세요" : "공유에 실패했어요");
  };

  return (
    <section className="bg-black px-6 pb-6 pt-4">
      {share.kakaoJsKey && (
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js"
          strategy="afterInteractive"
          onReady={() => {
            try {
              if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init(share.kakaoJsKey);
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error("[카카오공유] SDK 초기화 실패:", e);
            }
          }}
          onError={(e) => {
            // eslint-disable-next-line no-console
            console.error("[카카오공유] SDK 스크립트를 불러오지 못했습니다:", e);
          }}
        />
      )}

      <Reveal className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onKakaoShare}
          className="h-14 w-full rounded-xl bg-[#FEE500] text-base font-medium text-neutral-900 transition active:scale-[0.98]"
        >
          카카오톡 공유하기
        </button>
      </Reveal>
    </section>
  );
}
