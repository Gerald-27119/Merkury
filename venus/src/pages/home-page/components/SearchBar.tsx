import SearchInput from "./SearchInput";
import { FaSearch } from "react-icons/fa";

const inputList = [
    {
        label: "Your Country",
        id: "country",
    },
    {
        label: "Your Region",
        id: "region",
    },
    {
        label: "Your City",
        id: "city",
    },
];

export default function SearchBar() {
    return (
        <div className="dark:bg-darkBgSoft flex w-1/2 items-center justify-between space-x-3 rounded-md px-3 py-2 shadow-md dark:shadow-black">
            <div className="flex w-full flex-col space-y-2">
                <h1>Location</h1>
                <div className="flex w-full space-x-2">
                    {inputList.map((i) => (
                        <SearchInput
                            key={i.id}
                            label={i.label}
                            id={i.id}
                            value={""}
                            onChange={() => {}}
                            onBlur={() => {}}
                        />
                    ))}
                </div>
            </div>
            <button className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 cursor-pointer rounded-md p-2">
                <FaSearch />
            </button>
        </div>
    );
}
