// ─────────────────────────────────────────────────────────────
// 청첩장에 들어가는 모든 텍스트·정보를 이 파일 한 곳에서 관리합니다.
// [ ] 로 표시된 값은 아직 실제 정보로 교체되지 않은 자리표시자입니다.
// ─────────────────────────────────────────────────────────────

export const couple = {
  groom: {
    name: "김진우",
    // 아버지/어머니 성함을 넣고 싶으면 채워주세요. 비워두면 화면에 표시되지 않습니다.
    fatherName: "",
    motherName: "",
    photo: "/groom.jpg",
  },
  bride: {
    name: "김수연",
    fatherName: "",
    motherName: "",
    photo: "/bride.jpg",
  },
};

export const wedding = {
  // JS Date의 month는 0부터 시작하므로 dday.ts 에서 -1 처리합니다. 아래는 사람이 읽기 쉬운 형태로 보관.
  year: 2026,
  month: 11,
  day: 15,
  hour: 12,
  minute: 20,
  dayOfWeekLabel: "일요일",
  displayDate: "2026년 11월 15일 일요일 오후 12시 20분",
  venueName: "공군호텔 3층 그랜드볼룸홀",
  address: "서울특별시 영등포구 여의대방로 259",
};

// InvitationSection에 들어갈 초대 문구입니다.
// 두 분이 원하는 문구가 따로 있다면 아래 문자열만 교체하면 됩니다.
export const invitationText = `서로 다른 길을 걸어온 두 사람이
이제 같은 곳을 바라보며 걸어가려 합니다.

봄에 만나 사계절을 함께 보내는 동안
저희 두 사람은 서로에게 가장 편안한 쉼표가 되었습니다.

이제 그 마음을 지키며 살아가겠다는 약속의 자리에
소중한 분들을 모시고 싶습니다.

오셔서 저희의 새로운 시작을
따뜻한 마음으로 축복해 주시면 감사하겠습니다.`;

export const accounts = {
  groomSide: {
    label: "신랑측",
    // [이름] / [은행명] / [번호] — 실제 계좌 정보로 교체해주세요.
    holder: "[예금주 이름]",
    bank: "[은행명]",
    number: "[계좌번호]",
  },
  brideSide: {
    label: "신부측",
    holder: "[예금주 이름]",
    bank: "[은행명]",
    number: "[계좌번호]",
  },
};

export const directions = {
  bus: "[버스 노선 안내를 입력해주세요. 예: OO번, OO번 승차 후 'OO정류장' 하차]",
  subway: "[지하철 안내를 입력해주세요. 예: O호선 OO역 O번 출구에서 도보 O분]",
  car: "[자가용 안내 / 주차 안내를 입력해주세요. 예: 내비게이션에 '공군호텔' 검색, 지하주차장 2시간 무료]",
  mapUrl: "https://map.kakao.com/", // 카카오맵 또는 네이버지도 공유 링크로 교체해주세요.
  mapButtonLabel: "지도에서 보기",
};

// Kakao 공유(OG) 관련 텍스트. layout.tsx 의 메타데이터에서 사용됩니다.
export const ogMeta = {
  title: `${couple.groom.name} ♥ ${couple.bride.name} 결혼합니다`,
  description: `${wedding.displayDate} | ${wedding.venueName}`,
  imagePath: "/kakao.jpg",
};

export const gallery = {
  count: 22,
  basePath: "/gallery",
  extension: "jpg",
};

export const bgm = {
  src: "/bgm.mp3",
};
