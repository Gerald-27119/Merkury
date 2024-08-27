const gradient =
  "bg-gradient-to-r from-purple-500  to-teal-500 hover:to-purple-600  hover:from-teal-600";

export default function Button({ children, className }) {
  return (
    <button
      className={`${className} ${gradient} duration-600 justify-center rounded px-5 py-2 text-center align-middle text-5xl leading-normal text-fuchsia-50 transition-all delay-200 ease-in-out`}
    >
      {children}
    </button>
  );
}
