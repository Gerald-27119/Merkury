import AccountTitle from "../components/AccountTitle";

export default function SpotLists() {
  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText h-full w-full space-y-10 p-10 pt-17">
      <AccountTitle text="spots lists" />
      <div className="flex max-w-full gap-5 lg:mx-27">
        <button className="bg-violetDark hover:bg-violetDark/80 mr-15 w-full cursor-pointer rounded-md px-1.5 py-2 shadow-md">
          All
        </button>
        <button className="bg-violetDark hover:bg-violetDark/80 w-full cursor-pointer rounded-md px-1.5 py-2 shadow-md">
          Favorites
        </button>
        <button className="bg-violetDark hover:bg-violetDark/80 w-full cursor-pointer rounded-md px-1.5 py-2 shadow-md">
          Plan to visit
        </button>
        <button className="bg-violetDark hover:bg-violetDark/80 w-full cursor-pointer rounded-md px-1.5 py-2 shadow-md">
          Visited liked it
        </button>
        <button className="bg-violetDark hover:bg-violetDark/80 w-full cursor-pointer rounded-md px-1.5 py-2 shadow-md">
          Visited didn't like it
        </button>
        <button className="bg-violetDark hover:bg-violetDark/80 w-full cursor-pointer rounded-md px-1.5 py-2 shadow-md">
          Commented by you
        </button>
      </div>
      <div></div>
    </div>
  );
}
