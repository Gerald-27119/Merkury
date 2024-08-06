export default function Input({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="uppercase text-sm text-gray-600 pb-1">
        {label}
      </label>
      <input id={id} {...props} />
      <div>
        {error.value && (
          <p className="text-red-500 font-bold text-sm break-words">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
