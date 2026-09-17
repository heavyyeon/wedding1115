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

export type AccountEntry = {
  name: string; // 카드 제목 (예: "신랑", "신랑 아버지")
  holder: string; // 예금주 이름
  bank: string; // 은행명
  number: string; // 계좌번호
  // 카카오페이 송금 링크가 있으면 채워주세요 (카카오페이 앱 > 송금 > 계좌 등록 후 "송금 요청" 링크 복사).
  // 비워두면 화면에 "pay" 버튼이 표시되지 않습니다.
  kakaopayLink?: string;
};

// [ ] 로 표시된 값은 실제 정보로 교체해주세요. 부모님 계좌가 없으면 해당 항목을 배열에서
// 통째로 지워도 됩니다 (예: 신랑 아버지 계좌가 없으면 아래 배열에서 그 객체만 삭제).
export const accounts = {
  groomSide: {
    label: "신랑측",
    people: [
      { name: "신랑", holder: "[예금주 이름]", bank: "[은행명]", number: "[계좌번호]" },
      { name: "신랑 아버지", holder: "[예금주 이름]", bank: "[은행명]", number: "[계좌번호]" },
      { name: "신랑 어머니", holder: "[예금주 이름]", bank: "[은행명]", number: "[계좌번호]" },
    ] as AccountEntry[],
  },
  brideSide: {
    label: "신부측",
    people: [
      { name: "신부", holder: "[예금주 이름]", bank: "[은행명]", number: "[계좌번호]" },
      { name: "신부 아버지", holder: "[예금주 이름]", bank: "[은행명]", number: "[계좌번호]" },
      { name: "신부 어머니", holder: "[예금주 이름]", bank: "[은행명]", number: "[계좌번호]" },
    ] as AccountEntry[],
  },
};

export type SubwayInfo = { line: string; color: string; desc: string };
export type BusInfo = { type: string; numbers: string };

export const directions = {
  // "네이버지도/티맵/카카오내비" 버튼이 위치를 검색할 때 쓰는 검색어입니다. 정확한 GPS 좌표를
  // 직접 넣는 대신, 실제 주소/건물명 텍스트를 각 지도 서비스에 그대로 넘겨서 그 서비스가 직접
  // 정확한 위치를 찾아가도록 합니다. 주소나 건물명이 바뀌면 이 값만 수정하면 됩니다.
  searchQuery: "서울특별시 영등포구 여의대방로 259 공군호텔",

  // 지도 위치를 보여주는 정적 이미지입니다 (움직이는 지도가 아니라, 네이버지도/카카오맵에서
  // 위치를 캡처한 스크린샷을 그대로 사진처럼 넣는 방식 — API 키가 필요 없어요).
  mapImage: "/map-preview.jpg",

  // "약도 이미지 보기" 버튼을 누르면 뜨는 손그림/캡처 약도 이미지
  mapGuideImage: "/map-guide.jpg",

  // 지하철 안내 목록 (원하는 만큼 추가/삭제 가능)
  subway: [
    { line: "[호선]", color: "#a8d96c", desc: "[역 이름 O번 출구]" },
  ] as SubwayInfo[],
  subwayWalk: "[출구에서부터의 도보 안내를 입력해주세요. 예: 좌측 방향 500m 도보 후 좌측 건물]",

  // 버스 안내 목록 (원하는 만큼 추가/삭제 가능)
  bus: [
    { type: "간선버스", numbers: "[번호를 입력해주세요]" },
    { type: "지선버스", numbers: "[번호를 입력해주세요]" },
  ] as BusInfo[],
  busShuttle: "", // 셔틀버스 안내가 있다면 입력 (없으면 빈 문자열로 두면 화면에 표시되지 않습니다)

  // 자가용 안내
  car: "[자가용 안내 / 주차 안내를 입력해주세요. 예: 내비게이션에 '공군호텔' 검색, 지하주차장 2시간 무료]",
};

// Kakao 공유(OG) 관련 텍스트. layout.tsx 의 메타데이터에서 사용됩니다.
export const ogMeta = {
  title: `${couple.groom.name} ♥ ${couple.bride.name} 결혼합니다`,
  description: `${wedding.displayDate} | ${wedding.venueName}`,
  imagePath: "/kakao.jpg",
};

export const gallery = {
  count: 15,
  basePath: "/gallery",
  extension: "png",
};

export const bgm = {
  src: "/bgm.mp3",
};
