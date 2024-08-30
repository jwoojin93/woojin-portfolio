export const metadata = { title: "Readme: Web Page Description" };

export default async function ReadmePage() {
  return (
    <div className="pb-28  [&_b]:bg-pink-100 [&_b]:px-1 [&_b]:rounded-md [&_b]:font-normal">
      <h1 className="text-7xl text-center mt-5 font-rubick text-gray-900 font-extrabold">
        Project Description
      </h1>

      <p className="text-center mt-10">
        이 웹페이지는 <b>next.js 14 App Route</b> 방식으로 제작되었으며
        <br />
        <b>vercel</b> 을 통해 배포되었습니다.
      </p>

      <p className="text-center mt-3 ">
        데이터베이스는 vercel 에 <b>postgreSql</b> 을 사용하며, <br /> 이미지
        서버는 <b>Cloudflare Image</b> 를 사용합니다.
      </p>

      <p className="text-center mt-3 mb-10">
        각 탭에 대한 설명은 아래와 같습니다.
      </p>

      <p className="text-center">
        <span className="text-xl font-semibold text-orange-700">Intro</span>
        <br />웹 페이지 개발자에 대한 간략한 소개 입니다.
        <br />
        로그인 페이지와 intro 탭에는 <b>@react-three/fiber</b> 를 이용한 3d
        객체를 구현되어 있습니다.
      </p>

      <p className="text-center mt-5">
        <span className="text-xl font-semibold text-orange-700">Readme</span>
        <br />
        웹페이지에 대한 설명입니다.
      </p>

      <p className="text-center mt-5">
        <span className="text-xl font-semibold text-orange-700">Post</span>
        <br />
        게시글을 남길 수 있는 탭입니다.
        <br /> 이미지와 제목, 설명을 등록하여 여러분이 원하는 게시글을 작성해
        보세요.
        <br /> 게시글에 채팅하기를 클릭하여 게시글 작성자와 채팅을 시작할 수
        있습니다. <br /> 좋아요 버튼을 클릭하여 게시글에 공감을 표현할 수
        있습니다. <br /> 조회수를 확인하여 해당 게시글을 몇번 조회했는지 확인할
        수 있습니다.
        <br /> 게시글에 댓글을 남길 수 있습니다.
      </p>

      <p className="text-center mt-5">
        <span className="text-xl font-semibold text-orange-700">Chat</span>
        <br />
        생성된 채팅방 목록을 확인할 수 있는 탭입니다.
        <br /> 채팅방을 클릭하여 채팅을 이어나갈 수 있습니다.
      </p>

      <p className="text-center mt-5">
        <span className="text-xl font-semibold text-orange-700">My</span>
        <br />내 유저 정보와 로그아웃 기능이 있는 탭입니다.
      </p>

      <p className="text-gray-600 text-sm text-center mt-3">
        생성한지 얼마되지 않아서 아직 다듬어야 할 부분이 많습니다 ..🫥
      </p>
    </div>
  );
}
