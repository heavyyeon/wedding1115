import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Mono } from "next/font/google";
import "./globals.css";
import { ogMeta, couple } from "@/data/wedding";
import { ToastProvider } from "@/context/ToastContext";
import GrainOverlay from "@/components/GrainOverlay";
import BgmToggle from "@/components/BgmToggle";

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

export const metadata: Metadata = {
  // 카카오톡 등에서 공유 썸네일 이미지가 절대 URL로 뜨도록, 배포 후 실제 도메인을
  // NEXT_PUBLIC_SITE_URL 환경변수로 설정해주세요 (예: https://your-wedding.vercel.app).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
            <BgmToggle />
          </div>
          <GrainOverlay />
        </ToastProvider>
      </body>
    </html>
  );
}
