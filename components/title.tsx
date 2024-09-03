export default function Title({
  value,
  className,
}: {
  value: String;
  className?: String;
}) {
  return (
    <h1
      className={`text-5xl sm:text-7xl text-center mt-5 mb-5 font-rubick text-gray-900 font-extrabold ${className}`}
    >
      {value}
    </h1>
  );
}
