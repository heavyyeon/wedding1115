import TitleCard from "@/components/TitleCard";
import WhenWhereSection from "@/components/WhenWhereSection";
import GallerySection from "@/components/GallerySection";
// 방명록(GuestBookSection)은 요청에 따라 화면에서만 잠시 숨겨둔 상태입니다.
// 컴포넌트 파일(GuestBookSection.tsx)과 관련 코드는 전부 그대로 남아있으니,
// 나중에 다시 보이게 하고 싶으면 이 import 줄과 아래 <GuestBookSection /> 줄의
// 맨 앞 "// " 만 지우면 바로 복구됩니다.
// import GuestBookSection from "@/components/GuestBookSection";
import DirectionsSection from "@/components/DirectionsSection";
import AccountSection from "@/components/AccountSection";

export default function HomePage() {
  return (
    <>
      <TitleCard />
      <WhenWhereSection />
      <GallerySection />
      {/* <GuestBookSection /> */}
      <DirectionsSection />
      <AccountSection />
      <footer className="px-6 pb-10 pt-4 text-center">
        <p className="font-serif text-xs tracking-widest text-neutral-400">
          {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
