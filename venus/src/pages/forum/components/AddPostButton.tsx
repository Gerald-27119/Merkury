import { FiPlus } from "react-icons/fi";

export default function AddPostButton({}) {
  return (
    <div className="flex w-42 cursor-pointer items-center gap-1 rounded-2xl bg-blue-500 p-2 font-bold">
      <FiPlus className="text-2xl" />
      <span className="whitespace-nowrap">New Discussion</span>
    </div>
  );
}
