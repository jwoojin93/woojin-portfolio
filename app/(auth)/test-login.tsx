import { testLogIn } from "./login/actions";
import Button from "@/components/button";

export default function TestLogin() {
  const submit = async () => {
    "use server";
    await testLogIn();
  };

  return (
    <form action={submit} className="w-full">
      <Button text="테스트 로그인" />
    </form>
  );
}
