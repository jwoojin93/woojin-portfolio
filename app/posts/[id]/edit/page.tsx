"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getPost, getUploadUrl, updatePost } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostType, postSchema } from "./schema";
import { BrowserView, MobileView } from "react-device-detect";
import Textarea from "@/components/textarea";
import Header from "@/components/header";
import BackButton from "@/components/back-button";
import { useParams } from "next/navigation";
import ArrowButton from "@/components/arrow-button";

export default function EditPost() {
  interface IPost {
    id: number;
    userId: number;
    title: string;
    description: string | null;
    photo: String | null;
  }

  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostType>({
    resolver: zodResolver(postSchema),
  });

  const params = useParams();

  useEffect(() => {
    async function runEffect(id: string) {
      const post = await getPost(parseInt(id));
      if (post) {
        setValue("title", post.title);
        if (post.description) setValue("description", post.description);
        if (post.photo) {
          setPreview(`${post.photo}/public`);
          setValue("photo", post.photo);
        }
      }
    }

    if (typeof params.id === "string") {
      runEffect(params.id);
    }
  }, [params]);

  /**
   * 게시물 이미지 이벤트
   * 이미지에 파일이 들어오면 cloudflare 에서 upload url 을 가져옵니다.
   * @param event
   * @returns
   */
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    // 파일이 없을 경우 종료한다.
    if (!files) return;

    // 파일과 preview url 을 상태에 저장한다.
    const file = files[0];
    const url = URL.createObjectURL(file); // TODO(woojin): URL.createObjectURL 의 기능은?
    setPreview(url);
    setFile(file);

    // upload url 과 value 를 상태에 저장한다.
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/TBSHUFfEQ6p_mgBGqIAsXA/${id}`
      );
    }
  };

  /**
   * 제출하기 이벤트 처리
   */
  const onSubmit = handleSubmit(async (data: PostType) => {
    // 폼을 만들고 file을 추가한다.
    if (file) {
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "post",
        body: cloudflareForm,
      });
      // post 결과가 정상이 아니면 종료한다.
      if (response.status !== 200) return;
    }

    // form 에 title, description, photo 를 추가한다.
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    console.log("formData 33: ", formData);
    console.log("data 33: ", data);

    if (data.photo) formData.append("photo", data.photo);
    else formData.append("photo", "");

    const errors = await updatePost(formData, parseInt(String(params.id)));
    console.log("errors: ", errors);
  });

  const onValid = async () => {
    await onSubmit();
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("title", e.target.value);
  };

  const onDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("description", e.target.value);
  };

  return (
    <>
      <Header>
        <BackButton />
      </Header>
      <div className="pt-10">
        <form action={onValid} className="p-5 flex flex-col gap-5">
          <BrowserView>
            <label
              htmlFor="photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
              style={{ backgroundImage: `url(${preview})` }}
            >
              {preview === "" ? (
                <>
                  <PhotoIcon className="w-20" />
                  <div className="text-neutral-400 text-sm">
                    사진을 추가해주세요.
                    {errors.photo?.message}
                  </div>
                </>
              ) : null}
            </label>
            <input
              onChange={onImageChange}
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              className="hidden"
            />
          </BrowserView>

          <MobileView>
            <p className="text-center text-neutral-600 leading-7 break-keep">
              사진 업로드 기능은 현재는 PC 에서만 사용 가능합니다
            </p>
          </MobileView>

          <Input
            required
            placeholder="제목"
            type="text"
            {...register("title")}
            onChange={onTitleChange}
            errors={[errors.title?.message ?? ""]}
          />
          <Textarea
            required
            placeholder="자세한 설명"
            {...register("description")}
            onChange={onDescChange}
            errors={[errors.description?.message ?? ""]}
          />
          <Button text="수정 완료" />
        </form>
      </div>
      <ArrowButton bottom={"bottom-5"} />
    </>
  );
}
