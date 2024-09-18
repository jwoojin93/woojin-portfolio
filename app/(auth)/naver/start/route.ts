import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://nid.naver.com/oauth2.0/authorize";

  const params = {
    response_type: "code", // 인증 과정에 대한 내부 구분값으로 'code' 로 전송해야 함
    client_id: process.env.NAVER_CLIENT_ID!, // 애플리케이션 등록 시 발급받은 Client ID 값
    redirect_uri: "http://localhost:3000/naver/complete", // 애플리케이션 등록 시 입력한 Callback URL 값으로 URL 인코딩을 적욯한 값
    state: "http://localhost:3000/naver/complete", // 사이트 간 요청 위조 (cross-site request forgery) 공격을 방지하기 위해 애플리케이션에서 생성한 상태 토큰값으로, URL 인코딩을 적용한 값을 사용
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;

  return redirect(finalUrl);
}
