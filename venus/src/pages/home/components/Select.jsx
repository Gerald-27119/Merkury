export default function Select() {
  return (
    <div className="flex flex-col w-full items-center space-y-1">
      <label className="font-semibold text-lg">Sort</label>
      <select className="py-2 px-3 rounded-md w-3/4 focus:outline-none bg-darkBgMuted focus:ring-1 dark:focus:ring-darkBorder focus:ring-lightBorder">
        <option>Default</option>
        <option>Increase by name</option>
        <option>Decrease by name</option>
        <option>Increase by rating</option>
        <option>Decrease by rating</option>
      </select>
    </div>
  );
}
