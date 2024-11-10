export default function Button({
  children,
  classNames = "",
  onClick = (f) => f,
}) {
  return (
    <button
      onClick={onClick}
      className={`${classNames} bg-gradient-to-r from-purple-500  to-teal-500 hover:to-purple-600  hover:from-teal-600 duration-600 justify-center rounded text-center align-middle leading-normal text-fuchsia-50 transition-all delay-200 ease-in-out`}
    >
      {children}
    </button>
  );
}
