import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

/**
 * session 이 없어도 갈 수 있는 공용 url 입니다.
 */
const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

/**
 * 요청에 따라서 어떻게 처리할 지 middleware 를 정의합니다.
 * @param request 들어온 요청입니다.
 * @returns
 */
export async function middleware(request: NextRequest) {
  const session = await getSession(); // 세션 가져오기
  const exists = publicOnlyUrls[request.nextUrl.pathname]; // 공용 url 인지 확인.

  if (!session.id) {
    // session 이 없고, 공용 url 이 아닐 경우 '/' 로 이동합니다.
    if (!exists) return NextResponse.redirect(new URL("/", request.url));
  } else {
    // session 이 있지만 공용 url 이 경우 '/home' 으로 이동합니다..? => 잘못 이해했나? 왜 'home' 으로 가지? 요청에 있는 url 로 가면 되지 않나?
    if (exists) return NextResponse.redirect(new URL("/home", request.url));
  }
}

/**
 * middleware 가 동작할 지 여부를 정의하는 matcher 입니다.
 *
 * request 가
 * _next/static 이 아니거나
 * _next/image 가 아니거나
 * model 이 아니거나
 * texture 가 아니거나
 * favicon.ico 가 아닐 경우
 * matcher 가 동작합니다.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|model|texture|favicon.ico).*)"],
};
