import { HiMenu } from "react-icons/hi";

export default function PostSearchBar({}) {
  return (
    <div className="bg-darkBgSoft flex cursor-pointer items-center gap-2 rounded-2xl p-2">
      <input placeholder="Search"></input>
      <HiMenu className="text-2xl" />
    </div>
  );
}
