import { closingText } from "@/data/wedding";
import Reveal from "@/components/Reveal";

// 계좌 없는 버전(/invite)에서 계좌 칸 대신 보여주는 마무리 인사입니다.
// 문구는 src/data/wedding.ts 의 closingText 에서 바꿀 수 있어요.
export default function ClosingSection() {
  return (
    <section className="bg-black px-6 pb-12 pt-20 text-white">
      <Reveal className="text-center">
        <div className="flex flex-col gap-0.5 text-[13px] font-light leading-6 text-white/80">
          {closingText.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
