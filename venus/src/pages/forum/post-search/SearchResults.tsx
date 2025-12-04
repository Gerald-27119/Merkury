import { formatNumber } from "../../../utils/forum/numberFormatter";
import {PostSearchRequestDto} from "../../../model/interface/forum/post/postSearchRequestDto";

interface SearchResultsProps {
    data?: number;
    filters: PostSearchRequestDto;
}

export default function SearchResults({ data, filters }: SearchResultsProps) {
    const {
        searchPhrase = "",
        category = "",
        tags = [],
        fromDate = "",
        toDate = "",
        author = "",
    } = filters;

    const formattedCount = formatNumber(data ?? 0);
    const resultWord = data === 1 ? "result" : "results";

    const filterParts: string[] = [];

    if (category) filterParts.push(`category: ${category}`);
    if (tags.length > 0) filterParts.push(`tags: ${tags.join(", ")}`);
    if (author) filterParts.push(`author: ${author}`);
    if (fromDate) filterParts.push(`from: ${fromDate}`);
    if (toDate) filterParts.push(`to: ${toDate}`);

    const hasPhrase = searchPhrase?.trim().length > 0;
    const hasFilters = filterParts.length > 0;

    let message = "";

    if (hasPhrase && hasFilters) {
        message = `${formattedCount} ${resultWord} for "${searchPhrase}" filtered by ${filterParts.join(", ")}`;
    } else if (hasPhrase) {
        message = `${formattedCount} ${resultWord} for "${searchPhrase}"`;
    } else if (hasFilters) {
        message = `${formattedCount} ${resultWord} filtered by ${filterParts.join(", ")}`;
    } else {
        message = `${formattedCount} ${resultWord}`;
    }

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft flex w-md items-center gap-1 rounded-xl p-3 wrap-anywhere shadow-md md:w-2xl">
            <p className="text-lg font-bold">{message}</p>
        </div>
    );
}
