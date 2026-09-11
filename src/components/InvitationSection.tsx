import Image from "next/image";
import { invitationText } from "@/data/wedding";
import Reveal from "@/components/Reveal";

export default function InvitationSection() {
  return (
    <section className="bg-paper px-8 py-20">
      <Reveal className="mx-auto flex max-w-[320px] flex-col items-center gap-8 text-center">
        <div className="relative h-16 w-40">
          <Image
            src="/invitation.png"
            alt="초대합니다"
            fill
            sizes="200px"
            className="object-contain"
          />
        </div>

        <p className="whitespace-pre-line font-sans text-[15px] leading-loose text-neutral-600">
          {invitationText}
        </p>
      </Reveal>
    </section>
  );
}
