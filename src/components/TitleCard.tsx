"use client";

import { useState } from "react";
import Image from "next/image";
import { couple } from "@/data/wedding";

// 첫 화면에 위→아래로 이어 붙여 보여줄 사진 목록입니다 (public 폴더 안의 파일 이름).
// 사진을 더 붙이고 싶으면 아래 목록에 파일 이름을 한 줄 추가하면 됩니다.
// 이름/문구가 필요하면 사진 파일 자체에 디자인해서 넣어주세요.
const PHOTOS = ["/main-photo.png", "/main-photo-2.png"];

// 사진이 로드된 뒤 그 사진의 원본 가로:세로 비율을 측정해서, 사진 영역을 그 비율에 맞춥니다.
// 그래서 사진이 잘리지 않고 처음부터 끝까지 전부 보이고, 사진끼리 사이에 틈 없이 이어집니다.
function StackedPhoto({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  // 로드되기 전에는 흔한 세로 사진 비율(4:5)을 임시로 쓰고, 로드가 끝나면 실제 비율로 바꿉니다.
  const [ratio, setRatio] = useState(4 / 5);
  // 파일이 아직 올라가 있지 않아서 불러오지 못하면, 깨진 이미지 대신 이 칸을 통째로 숨깁니다.
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="480px"
        className="object-cover"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function TitleCard() {
  const alt = `${couple.groom.name}, ${couple.bride.name}`;
  return (
    <section className="flex w-full flex-col">
      {PHOTOS.map((src, i) => (
        <StackedPhoto key={src} src={src} alt={alt} priority={i === 0} />
      ))}
    </section>
  );
}
