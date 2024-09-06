import { ForwardedRef, TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps {
  name: string;
  errors?: string[];
  readOnly?: Boolean;
  className?: string;
}

const _Textarea = (
  {
    name,
    errors = [],
    readOnly,
    className,
    ...rest
  }: TextareaProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={ref}
        name={name}
        readOnly={readOnly}
        className={`bg-transparent rounded-md h-40 w-full focus:outline-none transition border-none placeholder:text-neutral-400 ${
          !readOnly
            ? "ring-2 focus:ring-4 ring-neutral-200 focus:ring-orange-500"
            : "border-transparent focus:border-transparent focus:ring-0"
        } ${className}`}
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
