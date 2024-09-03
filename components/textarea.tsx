import { ForwardedRef, TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps {
  name: string;
  errors?: string[];
}

const _Textarea = (
  {
    name,
    errors = [],
    ...rest
  }: TextareaProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={ref}
        name={name}
        className="bg-transparent rounded-md h-40 w-full focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(_Textarea);
