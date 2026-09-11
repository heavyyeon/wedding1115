import Image from "next/image";
import { couple } from "@/data/wedding";
import Reveal from "@/components/Reveal";

function PersonCard({
  photo,
  name,
  role,
  delay,
}: {
  photo: string;
  name: string;
  role: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="flex w-[42%] flex-col items-center gap-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white/60 shadow-sm">
        <Image src={photo} alt={name} fill sizes="240px" className="object-cover" />
      </div>
      <div className="text-center">
        <p className="font-mono text-[11px] tracking-[0.2em] text-neutral-400">{role}</p>
        <p className="font-serif text-lg text-neutral-800">{name}</p>
      </div>
    </Reveal>
  );
}

export default function CastingSection() {
  return (
    <section className="flex flex-col items-center gap-8 px-6 py-20">
      <Reveal className="text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-400">CASTING</p>
        <p className="mt-2 font-serif text-lg text-neutral-700">신랑 &amp; 신부를 소개합니다</p>
      </Reveal>

      <div className="flex w-full items-start justify-center gap-4">
        <PersonCard photo={couple.groom.photo} name={couple.groom.name} role="GROOM" delay={0} />
        <div className="mt-16 font-serif text-2xl text-accent">&amp;</div>
        <PersonCard photo={couple.bride.photo} name={couple.bride.name} role="BRIDE" delay={120} />
      </div>
    </section>
  );
}
