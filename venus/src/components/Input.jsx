export default function Input({ label, id, error, ...props }) {
  let classesInput = "p-2 rounded-md";
  if (error?.value) {
    classesInput += " outline  outline-red-600";
  }
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="uppercase text-sm text-gray-600 pb-1">
        {label}
      </label>
      <input id={id} className={classesInput} {...props} />
      <div>
        {error?.value && (
          <p className="text-red-500 font-bold text-sm break-words">
            {error?.message}
          </p>
        )}
      </div>
    </div>
  );
}
