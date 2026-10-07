import { NextResponse, type NextRequest } from "next/server";
import { share } from "@/data/wedding";

// 정식 주소의 호스트 이름 (예: wedding1115.vercel.app). 주소는 wedding.ts 의 share.siteUrl 한 곳에서 관리합니다.
const MAIN_HOST = new URL(share.siteUrl).host;

// Vercel은 배포할 때마다 wedding1115-xxxx-yeon6.vercel.app 같은 "임시 주소"를 자동으로 만들고,
// 이 주소는 없앨 수 없습니다. 그런데 카카오·네이버 지도처럼 "등록된 도메인에서만 동작"하는 서비스는
// 임시 주소에서는 막히기 때문에(4002 오류, 401 오류 등), 정식 주소가 아닌 .vercel.app 주소로
// 들어오면 같은 페이지의 정식 주소로 자동으로 이동시킵니다.
export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();

  if (host.endsWith(".vercel.app") && host !== MAIN_HOST) {
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${MAIN_HOST}`);
    return NextResponse.redirect(target, 307);
  }

  return NextResponse.next();
}

// 이미지·정적 파일 요청은 건드리지 않고, 페이지 주소에만 적용합니다.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
