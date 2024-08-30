import ThreeCanvas from "@/components/three/ThreeCanvas";

export const metadata = { title: "Who am I?" };

export default async function IntroPage() {
  return (
    <div className="pb-28">
      {/* rubic text 폰트로 */}
      <h1 className="text-7xl text-center mt-5 font-rubick text-gray-900 font-extrabold">
        Who Am I
      </h1>

      {/* 노트북, 데스크탑 화면 3d */}
      <div style={{ width: "100%", height: "30dvh" }}>
        <ThreeCanvas name="macbook-laptop" />
      </div>

      <p className="text-center">
        안녕하세요, 화면으로 유저와 소통하는 프론트 개발자 정우진 입니다.
      </p>

      {/* 비행기 3d */}
      <div style={{ width: "100%", height: "30dvh" }}>
        <ThreeCanvas name="airplane" />
      </div>

      <p className="text-center">
        저는 2012년 부터 2017년까지 공군부사관으로 했어요
      </p>
      <p className="text-gray-600 text-sm text-center">
        물론 비행기를 몰진 않았습니다..🫥
      </p>

      <p className="mt-10 text-center">
        저의 이력이 궁금하시다면{" "}
        <a
          href="https://docs.google.com/presentation/d/1qc6l6YXu1EKpP8mmrbl1dwPrPFD_2_Dfm1iceYrHw2w/edit?usp=sharing"
          target="_blank"
        >
          링크
        </a>
        를 눌러주세요.
      </p>
    </div>
  );
}
