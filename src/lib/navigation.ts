// 지도 앱으로 위치를 열어주는 링크입니다.
//
// 예전에는 위도/경도 좌표를 직접 넣는 방식이었는데, 정확한 좌표를 알 수 없는 상태에서
// 임의의 좌표를 넣으면 하객이 엉뚱한 곳으로 안내될 위험이 있었습니다. 그래서 좌표 대신
// 실제 주소/장소명 "검색어"를 각 지도 서비스에 그대로 전달해서, 그 서비스가 직접 정확한
// 위치를 찾아가도록 바꿨습니다.
//
// 티맵은 앱 전용 스킴이라 해당 앱이 설치되어 있지 않으면 반응이 없을 수 있어요.
// 실제 배포 후 본인 휴대폰에서 한 번씩 눌러 동작을 확인해보는 걸 추천해요.

// 네이버지도: 공식 검색 링크. 앱이 설치되어 있으면 앱으로 연결되고, 없으면 웹 지도로 열립니다.
export function naverMapSearchUrl(query: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

// 티맵: 이름으로 목적지를 검색해서 앱을 엽니다.
export function tmapSearchUrl(query: string) {
  return `tmap://search?name=${encodeURIComponent(query)}`;
}
