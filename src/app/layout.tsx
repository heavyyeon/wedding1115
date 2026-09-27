import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Mono } from "next/font/google";
import "./globals.css";
import { ogMeta, couple } from "@/data/wedding";
import { ToastProvider } from "@/context/ToastContext";
import GrainOverlay from "@/components/GrainOverlay";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

// 카카오톡 등에서 공유 썸네일 이미지가 절대 URL로 뜨려면, next/metadata가 이미지 경로를
// 계산할 때 기준으로 삼을 실제 배포 도메인이 필요합니다. Vercel 환경변수 설정 화면에서
// 자꾸 경고가 떠서 저장이 안 되는 문제가 있어, 환경변수 대신 정식 도메인을 코드에 직접
// 넣어두었습니다 (이 값은 비밀값이 아니라 그냥 공개 웹 주소라 코드에 있어도 안전합니다).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wedding1115.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: ogMeta.title,
  description: ogMeta.description,
  openGraph: {
    title: ogMeta.title,
    description: ogMeta.description,
    images: [{ url: ogMeta.imagePath }],
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${spaceMono.variable}`}>
      <body>
        <ToastProvider>
          <div className="page-shell" aria-label={`${couple.groom.name} ${couple.bride.name} 결혼식 초대장`}>
            {children}
          </div>
          <GrainOverlay />
        </ToastProvider>
      </body>
    </html>
  );
}
