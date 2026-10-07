import TitleCard from "@/components/TitleCard";
import WhenWhereSection from "@/components/WhenWhereSection";
import GallerySection from "@/components/GallerySection";
import GuestBookSection from "@/components/GuestBookSection";
import DirectionsSection from "@/components/DirectionsSection";
import AccountSection from "@/components/AccountSection";

export default function HomePage() {
  return (
    <>
      <TitleCard />
      <WhenWhereSection />
      <GallerySection />
      <GuestBookSection />
      <DirectionsSection />
      <AccountSection />
      {/* 마지막 섹션(마음을 전하실 곳)이 검정 바탕이라, 맨 아래 연도 줄도 검정으로 이어 붙였습니다. */}
      <footer className="bg-black px-6 pb-10 pt-4 text-center">
        <p className="font-serif text-xs tracking-widest text-white/40">
          {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
