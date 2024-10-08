"use client";

import FormButton from "@/components/button";
import FormInput from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { logIn } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Header from "@/components/header";
import BackButton from "@/components/back-button";

export default function LogIn() {
  const [state, dispatch] = useFormState(logIn, null);

  return (
    <>
      <Header>
        <BackButton />
      </Header>
      <div className="flex flex-col gap-10 mt-14">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">안녕하세요!</h1>
          <h2 className="text-xl">Log in with email and password.</h2>
        </div>
        <form action={dispatch} className="flex flex-col gap-3">
          <FormInput
            name="email"
            type="email"
            placeholder="Email"
            required
            errors={state?.fieldErrors.email}
          />
          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            errors={state?.fieldErrors.password}
          />
          <FormButton text="Log in" />
        </form>
      </div>
    </>
  );
}
