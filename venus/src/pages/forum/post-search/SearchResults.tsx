import { formatNumber } from "../../../utils/forum/numberFormatter";

interface SearchResultsProps {
    data?: number;
    searchPhrase?: string;
}

export default function SearchResults({
    data,
    searchPhrase,
}: SearchResultsProps) {
    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft flex w-md items-center gap-1 rounded-xl p-3 wrap-anywhere shadow-md md:w-2xl">
            <p className="text-lg font-bold">
                {formatNumber(data!)} {data === 1 ? "result" : "results"} for "
                {searchPhrase}"
            </p>
        </div>
    );
}
