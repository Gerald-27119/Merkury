export default function Button({
  children,
  classNames = "",
  onClick = (f) => f,
  ...props
}) {
  return (
    <button {...props} onClick={onClick} className={classNames}>
      {children}
    </button>
  );
}
