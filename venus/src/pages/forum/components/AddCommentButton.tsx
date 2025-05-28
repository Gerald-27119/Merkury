import { FiPlus } from "react-icons/fi";

export default function AddCommentButton() {
  return (
    <div className="ml-auto flex cursor-pointer items-center gap-1 rounded-3xl bg-gray-300 px-3 py-2 font-bold text-gray-900">
      <FiPlus className="text-2xl" />
      <span className="text-base whitespace-nowrap select-none">
        Add comment
      </span>
    </div>
  );
}
