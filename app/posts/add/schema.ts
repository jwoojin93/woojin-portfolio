import { z } from "zod";

export const postSchema = z.object({
  photo: z.string(),
  // 제목이 없으면 보여줄 에러 메시지
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  // 설명이 없으면 보여줄 에러 메시지
  description: z.string({
    required_error: "Description is required",
  }),
});

export type PostType = z.infer<typeof postSchema>;
