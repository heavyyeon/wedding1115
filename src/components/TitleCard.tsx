import Image from "next/image";
import { couple } from "@/data/wedding";

// 문구 없이 메인 사진 한 장만 꽉 채우는 첫 화면입니다.
// 이름/문구가 필요하면 /public/main-photo.jpg 자체에 디자인해서 넣어주세요.
export default function TitleCard() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <Image
        src="/main-photo.jpg"
        alt={`${couple.groom.name}, ${couple.bride.name}`}
        fill
        priority
        sizes="480px"
        className="object-cover"
      />
    </section>
  );
}
