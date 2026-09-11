// 지도 앱으로 바로 길안내를 여는 딥링크입니다.
// 앱이 설치되어 있지 않으면 아무 반응이 없을 수 있어요 (표준적인 커스텀 URL 스킴의 한계입니다).
// 실제 배포 후 본인 휴대폰에서 한 번씩 눌러 동작을 확인해보는 걸 추천해요.

export function naverMapAppUrl(lat: number, lng: number, name: string, appUrl: string) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    name,
    appname: appUrl,
  });
  return `nmap://place?${params.toString()}`;
}

export function tmapAppUrl(lat: number, lng: number, name: string) {
  const params = new URLSearchParams({
    goalx: String(lng),
    goaly: String(lat),
    goalname: name,
  });
  return `tmap://route?${params.toString()}`;
}

export function kakaoNaviAppUrl(lat: number, lng: number, name: string) {
  const params = new URLSearchParams({
    name,
    x: String(lng),
    y: String(lat),
    coord_type: "wgs84",
  });
  return `kakaonavi://navigate?${params.toString()}`;
}

// 앱이 없는 경우를 대비한 웹 fallback (새 탭으로 열림)
export function naverMapWebUrl(lat: number, lng: number, name: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}?c=${lng},${lat},17,0,0,0,dh`;
}
