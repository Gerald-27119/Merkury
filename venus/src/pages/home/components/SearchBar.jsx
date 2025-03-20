export default function SearchBar() {
  return (
    <div className="flex flex-col w-full items-center space-y-1">
      <label className="font-semibold text-lg ">City</label>
      <input
        type="text"
        className="py-2 px-3 rounded-md  w-full focus:outline-none bg-darkBgMuted focus:ring-1 dark:focus:ring-darkBorder focus:ring-lightBorder"
      />
    </div>
  );
}
