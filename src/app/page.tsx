import TitleCard from "@/components/TitleCard";
import WhenWhereSection from "@/components/WhenWhereSection";
import GallerySection from "@/components/GallerySection";
import GuestBookSection from "@/components/GuestBookSection";
import DirectionsSection from "@/components/DirectionsSection";
import AccountSection from "@/components/AccountSection";
import ShareButtons from "@/components/ShareButtons";

export default function HomePage() {
  return (
    <>
      <TitleCard />
      <WhenWhereSection />
      <GallerySection />
      <GuestBookSection />
      <DirectionsSection />
      <AccountSection />
      <ShareButtons />
      {/* 마음을 전하실 곳·공유 버튼과 같은 검정 바탕으로 이어집니다. */}
      <footer className="bg-black px-6 pb-10 pt-4 text-center">
        <p className="font-serif text-xs tracking-widest text-neutral-400">
          {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
