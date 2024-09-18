import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  // code 가 없을 경우 400 응답 반환
  if (!code) {
    return new Response(null, { status: 400 });
  }

  // access token param 설정
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  // access token url 설정
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  // 로그인 인증을 위한 POST 요청
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  const { error, access_token } = await accessTokenResponse.json();

  // error 가 있을 경우 404 로 응답 반환
  if (error) return new Response(null, { status: 400 });

  // 유저 프로필 정보 가져오기
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  // 유저 프로필 정보 (id, avatar, username)
  const { id, avatar_url, login } = await userProfileResponse.json();
  const user = await db.user.findUnique({
    where: { github_id: id + "" },
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
      username: login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: { id: true },
  });

  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/intro");
}
