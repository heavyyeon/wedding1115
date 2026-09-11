import Image from "next/image";
import { couple, wedding } from "@/data/wedding";
import Reveal from "@/components/Reveal";

export default function TitleCard() {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-end overflow-hidden">
      <Image
        src="/main-photo.jpg"
        alt={`${couple.groom.name}, ${couple.bride.name}`}
        fill
        priority
        sizes="480px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <Reveal className="relative z-10 flex w-full flex-col items-center gap-3 px-6 pb-16 text-center text-white">
        <p className="font-serif text-sm tracking-[0.35em] text-white/85">
          WE ARE GETTING MARRIED
        </p>
        <h1 className="font-serif text-2xl font-medium tracking-wide">
          {couple.groom.name} <span className="mx-2 text-accent">&</span> {couple.bride.name}
        </h1>
        <p className="font-mono text-xs tracking-widest text-white/80">
          {wedding.displayDate}
        </p>
      </Reveal>
    </section>
  );
}
