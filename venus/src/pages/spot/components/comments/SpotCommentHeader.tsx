import { FaPlus } from "react-icons/fa6";

export default function SpotCommentHeader() {
    return (
        <div className="dark:bg-violetDark w-full rounded-t-xl pt-2 pb-4">
            <div className="mx-4 mt-4 flex items-center justify-between">
                <h3 className="font-bold">Comments</h3>
                <button className="dark:bg-violetDarker dark:ring-violetBtnBorderDark/50 dark:hover:bg-violetLight flex w-fit cursor-pointer items-center rounded-full px-2 py-1 ring-2 2xl:px-3 2xl:py-2 2xl:text-xl">
                    <FaPlus className="text-sm 2xl:text-xl" />
                    <span className="ml-1.5 2xl:ml-2">Add</span>
                </button>
            </div>
        </div>
    );
}
