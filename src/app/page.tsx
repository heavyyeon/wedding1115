import IntroAnimation from "@/components/IntroAnimation";
import TitleCard from "@/components/TitleCard";
import CastingSection from "@/components/CastingSection";
import InvitationSection from "@/components/InvitationSection";
import WhenWhereSection from "@/components/WhenWhereSection";
import GallerySection from "@/components/GallerySection";
import GuestBookSection from "@/components/GuestBookSection";
import DirectionsSection from "@/components/DirectionsSection";
import AccountSection from "@/components/AccountSection";

export default function HomePage() {
  return (
    <>
      <IntroAnimation />
      <TitleCard />
      <CastingSection />
      <InvitationSection />
      <WhenWhereSection />
      <GallerySection />
      <GuestBookSection />
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
