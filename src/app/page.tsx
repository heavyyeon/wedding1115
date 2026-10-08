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
    </>
  );
}
