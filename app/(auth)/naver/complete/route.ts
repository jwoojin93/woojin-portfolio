import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const errorParam = request.nextUrl.searchParams.get("error");
  const error_description =
    request.nextUrl.searchParams.get("error_description");

  console.log("code: ", code);
  console.log("state: ", state);
  console.log("errorParam: ", errorParam);
  console.log("error_description: ", error_description);

  // code 가 없을 경우 400 응답 반환
  if (!code) {
    return new Response(null, { status: 400 });
  }

  // access token param 설정
  const accessTokenParams = new URLSearchParams({
    grant_type: "authorization_code", // 인증 발급에 대한 구분값 (발급: 'authorization_code', 갱신: 'refresh_token', 삭제: 'delete'), 필수
    client_id: process.env.NAVER_CLIENT_ID!, // 애플리케이션 등록 시 발급받은 Client ID 값, 필수
    client_secret: process.env.NAVER_CLIENT_SECRET!, // 애플리케이션 등록 시 발급받은 Client secret 값, 필수
    code: code, // 로그인 인증 요청 API 호출에 성공하고 리턴받은 인증코드 값 (authorization code), 발급 때 필수
    state: state!, // 사이트 간 요청 위조 (cross-site request forgery) 공격을 방지하기 위해 애플리케이션에서 생성한 상태 토큰 값으로 URL 인코딩을 적용한 값을 사용, 발급 때 필수
    refresh_token: "", // 네이버 사용자 인증에 성공하고 발급받은 갱신 토큰 (refresh token), 발급 때 필수
    access_token: "", // 기 발급받은 잡근 토큰으로 URL 인코딩을 적용한 값을 사용, 삭제 때 필수
    service_provider: "NAVER", // 인증 제공자 이름으로 'NAVER' 로 세팅해 전송
  }).toString();

  // access token url 설정
  const accessTokenURL = `https://nid.naver.com/oauth2.0/token?${accessTokenParams}`;

  // 로그인 인증을 위한 POST 요청
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  const { error, access_token } = await accessTokenResponse.json();

  // error 가 있을 경우 404 로 응답 반환
  if (error) return new Response(null, { status: 400 });

  // 유저 프로필 정보 가져오기
  const userProfileResponse = await fetch(
    "https://openapi.naver.com/v1/nid/me",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    }
  );

  /**
   * 유저 프로필 정보
   *
   * resultcode: API 호출 결과 코드
   * message: 호출 결과 메시지
   * response.id: 동일인 식별 정보, 동일인 식별 정보는 네이버 아이디마다 고유하게 발급되는 값입니다.
   * response.nickname: 사용자 별명
   * response.name: 사용자 이름
   * response.email: 사용자 메일 주소
   * response.gender: 셩별 (F: 여성, M: 남성, U: 확인불가)
   * response.age: 사용자 연령대
   * response.birthday: 사용자 생일 (MM-DD 형식)
   * response.profile_image: 사용자 프로필 사진 URL
   * response.birthyear: 출생연도
   * response.mobile: 휴대전화번호
   */
  const { resultcode, message, response } = await userProfileResponse.json();

  const user = await db.user.findUnique({
    where: { naver_id: response.id + "" },
    select: { id: true },
  });

  // 유저가 있을 경우 세션에 유저 아이디 저장 후 intro 탭으로 이동
  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/intro");
  }

  // 유저가 없을 경우 유저 DB 생성 후 intro tab 으로 이동
  const newUser = await db.user.create({
    data: {
      username: response.nickname,
      naver_id: response.id + "",
      avatar: response.profile_image,
    },
    select: { id: true },
  });

  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/intro");
}
