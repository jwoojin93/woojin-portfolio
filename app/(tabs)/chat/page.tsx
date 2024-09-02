import Title from "@/components/title";

export default function Chat() {
  // 채팅방 리스트 가져오기
  return (
    <div>
      <Title value="Chat Room" />
      <p className="text-gray-600 text-sm text-center ">
        채팅방이 없습니다. 게시글 탭에서 게시자와 채팅방을 생성해보세요.
      </p>
    </div>
  );
}
