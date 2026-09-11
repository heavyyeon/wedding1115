import { directions, wedding } from "@/data/wedding";
import Reveal from "@/components/Reveal";

const rows: { label: string; value: string }[] = [
  { label: "버스", value: directions.bus },
  { label: "지하철", value: directions.subway },
  { label: "자가용", value: directions.car },
];

export default function DirectionsSection() {
  return (
    <section className="px-6 py-20">
      <Reveal className="mb-8 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-400">DIRECTIONS</p>
        <p className="mt-2 font-serif text-lg text-neutral-700">오시는 길</p>
        <p className="mt-1 text-xs text-neutral-500">{wedding.address}</p>
      </Reveal>

      <Reveal className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl bg-white/70 p-4 shadow-sm">
            <p className="mb-1 font-mono text-[11px] tracking-widest text-accent">
              {row.label.toUpperCase()}
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
              {row.value}
            </p>
          </div>
        ))}

        <a
          href={directions.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-md border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-700 transition active:scale-[0.98]"
        >
          {directions.mapButtonLabel}
        </a>
      </Reveal>
    </section>
  );
}
