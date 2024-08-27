"use server";

import twilio from "twilio";
import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";

/**
 * 전화번호 스키마를 정의합니다.
 */
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

/**
 * token 이 존재하는지 여부를 확인합니다.
 * @param token
 * @returns
 */
async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: { token: token.toString() },
    select: { id: true },
  });
  return Boolean(exists);
}

/**
 * 토큰 스키마를 정의합니다.
 */
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");

interface ActionState {
  token: boolean;
}

/**
 * 토큰을 가져옵니다.
 * @returns
 */
async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();

  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true },
  });

  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

/**
 * sms 로그인 기능입니다.
 * @param prevState
 * @param formData
 * @returns
 */
export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone"); // form 으로부터 phone 을 가져옵니다.
  const token = formData.get("token"); // form 으로부터 token 을 가져옵니다.

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    if (!result.success) {
      // 전화 번호 스키마에 문제가 있을 경우 에러를 반환합니다.
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // 전화 번호 스키마가 정상일 경우

      // 1. sMSToken 데이터베이스에서 일치하는 전화번호를 가진 컬럼을 삭제합니다.
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      const token = await getToken(); // 토큰을 가져옵니다.

      // 2. 전화번호와 일치하는 유저가 있을 경우 연결하고 없을 경우 sMSToken 컬럼을 생성합니다..? 맞나? connectOrCreate 가 뭐였지?
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: { phone: result.data },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // twilio account sid 와 twilio auth toekn 을 이용하여 twilio client 를 생성합니다.
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // twilio client message 를 생성합니다.
      await client.messages.create({
        body: `Your Karrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!,
      });

      // token 여부를 반영합니다..?
      return { token: true };
    }
  } else {
    // spa 가 safeparse 줄임말 맞나?
    const result = await tokenSchema.spa(token);

    if (!result.success) {
      // 토큰 스키마가 정상이 아닐 경우 에러를 반환합니다.
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // 토큰 스키마가 정상일 경우 token 과 일치하는 sMSToken 컬럼을 조회합니다.
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      const session = await getSession();
      session.id = token!.userId;

      // session.save() 가 뭐였지?
      await session.save();

      // sms 인증이 완료되면 sMSToken 데이터베이스에서 token 과 일치하는 컬럼을 제거합니다..?
      await db.sMSToken.delete({
        where: { id: token!.id },
      });

      // SMS 인증이 완료되면 profile 페이지로 이동합니다..?
      redirect("/profile");
    }
  }
}
