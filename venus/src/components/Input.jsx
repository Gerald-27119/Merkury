export default function Input({
  label,
  id,
  isValid,
  labelClassNames,
  ...props
}) {
  let classesInput = "p-2 rounded-md";
  if (!isValid?.value) {
    classesInput += " outline  outline-red-600";
  }
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className={
          labelClassNames
            ? labelClassNames
            : "uppercase text-sm text-gray-600 pb-1"
        }
      >
        {label}
      </label>
      <input id={id} className={classesInput} {...props} />
      <div>
        {!isValid?.value && (
          <p className="text-red-500 font-bold text-sm break-words">
            {isValid?.message}
          </p>
        )}
      </div>
    </div>
  );
}
