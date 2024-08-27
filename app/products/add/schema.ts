import { z } from "zod";

export const productSchema = z.object({
  // 사진이 없으면 보여줄 에러 메시지
  photo: z.string({
    required_error: "Photo is required",
  }),
  // 제목이 없으면 보여줄 에러 메시지
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  // 설명이 없으면 보여줄 에러 메시지
  description: z.string({
    required_error: "Description is required",
  }),
  // 가격이 없으면 보여줄 에러 메시지
  price: z.coerce.number({
    required_error: "Price is required",
  }),
});

export type ProductType = z.infer<typeof productSchema>;
