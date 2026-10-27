import TitleCard from "@/components/TitleCard";
import WhenWhereSection from "@/components/WhenWhereSection";
import GallerySection from "@/components/GallerySection";
import GuestBookSection from "@/components/GuestBookSection";
import DirectionsSection from "@/components/DirectionsSection";
import ClosingSection from "@/components/ClosingSection";
import ShareButtons from "@/components/ShareButtons";
import { inviteOnlyUrl } from "@/data/wedding";

// 계좌 정보가 없는 버전 (주소: /invite).
// 기본 버전(src/app/page.tsx)과 따로 구성되어 있어서, 여기서 칸을 빼거나 순서를 바꿔도
// 기본 버전에는 영향이 없습니다.
export default function InvitePage() {
  return (
    <>
      <TitleCard />
      <WhenWhereSection />
      <GallerySection />
      <GuestBookSection />
      <DirectionsSection />
      <ClosingSection />
      <ShareButtons url={inviteOnlyUrl} />
    </>
  );
}
