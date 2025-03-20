export default function TagCheckbox({ number }) {
  return (
    <div className="hover:bg-darkBgMuted space-x-2 py-1 px-2 flex items-center">
      <input
        type="checkbox"
        id={`tag${number}`}
        className="appearance-none p-3 checked:bg-darkBg bg-darkBgMuted rounded-md hover:ring-1 hover:ring-darkBorder checked:ring-1 checked:ring-darkBorder"
      />
      <label className=" w-full" htmlFor={`tag${number}`}>
        Tag {number}
      </label>
    </div>
  );
}
