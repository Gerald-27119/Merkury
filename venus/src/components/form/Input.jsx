export default function Input({
  label,
  id,
  isValid = { value: true, message: "" },
  labelClassNames,
  ...props
}) {
  let classesInput =
    "p-2 rounded-md dark:bg-neutral-800 bg-lightBgMuted focus:outline-none dark:text-darkText text-lightText";
  if (!isValid?.value) {
    classesInput += " outline outline-1  outline-red-600";
  }
  // TODO: Zrobić aby przy podaniu errora nie poszeszało się miejsce
  //TODO: Zrobić jak na xkom
  return (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor={id}
        className={
          labelClassNames ||
          "uppercase text-sm dark:text-darkText text-lightText pb-1"
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
