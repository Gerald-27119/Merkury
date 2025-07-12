import { HiMenu } from "react-icons/hi";

export default function ForumSearchBar({}) {
    return (
        <div className="bg-darkBgSoft flex items-center gap-2 rounded-2xl p-2">
            <input className="focus:outline-none" placeholder="Search"></input>
            <HiMenu className="cursor-pointer text-2xl" />
        </div>
    );
}
