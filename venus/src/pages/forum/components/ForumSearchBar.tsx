import { HiMenu } from "react-icons/hi";

export default function ForumSearchBar({}) {
    return (
        <div className="dark:bg-darkBgSoft mb-4 flex items-center gap-2 rounded-2xl p-2 shadow-lg">
            <input className="focus:outline-none" placeholder="Search"></input>
            <HiMenu className="cursor-pointer text-2xl" />
        </div>
    );
}
