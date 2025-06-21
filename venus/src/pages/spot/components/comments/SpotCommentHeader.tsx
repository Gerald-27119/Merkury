import { FaPlus } from "react-icons/fa6";

export default function SpotCommentHeader() {
  return (
    <div className="w-full">
      <div className="mx-4 my-4 flex items-center justify-between">
        <h3 className="font-bold">Comments</h3>
        <button className="bg-violetDarker ring-violetBtnBorderDark/50 dark:hover:bg-violetLight flex w-fit cursor-pointer items-center rounded-full px-3 py-2 text-xl ring-1">
          <FaPlus />
          <span className="ml-2">Add</span>
        </button>
      </div>
    </div>
  );
}
