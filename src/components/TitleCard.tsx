"use client";

import { useState } from "react";
import Image from "next/image";
import { couple } from "@/data/wedding";

// 문구 없이 메인 사진 한 장만 보여주는 첫 화면입니다.
// 이름/문구가 필요하면 /public/main-photo.png 자체에 디자인해서 넣어주세요.
//
// 예전에는 화면 높이(세로)에 꽉 채우고 object-cover로 잘라내는 방식이라, 사진의 가로세로
// 비율이 화면 비율과 다르면 사진 위/아래가 잘려서 보이는 문제가 있었습니다. 지금은 반대로
// 사진이 실제로 로드된 뒤 그 사진의 원본 가로:세로 비율을 측정해서, 화면 영역 자체를
// 그 비율에 맞게 만듭니다. 그래서 사진이 잘리지 않고 항상 처음부터 끝까지 전부 보입니다.
export default function TitleCard() {
  // 사진이 아직 로드되기 전에는 흔한 세로 사진 비율(4:5)을 기본값으로 잠깐 보여주고,
  // 로드가 끝나면 실제 비율로 바꿔줍니다.
  const [ratio, setRatio] = useState(4 / 5);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src="/main-photo.png"
        alt={`${couple.groom.name}, ${couple.bride.name}`}
        fill
        priority
        sizes="480px"
        className="object-cover"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
    </section>
  );
}
