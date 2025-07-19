import { useQuery } from "@tanstack/react-query";
import { trendingTenorGifs } from "../../../../../../http/gifs";
import { TrendingGifCategory } from "../../../../../../model/interface/chat/gifs/gifInterfaces";

export default function GifWindow() {
    const { data: trendingGifCategoriesData, isSuccess } = useQuery({
        queryKey: ["trending-gifs-categories"],
        queryFn: trendingTenorGifs,
    });

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="px-3 py-2">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    className="bg-violetLight w-full rounded-xl p-2"
                />
            </div>
            <div className="bg-violetLightDarker scrollbar-track-violetLightDarker hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-w-1 scrollbar mt-2 grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-auto rounded-b-xl p-3">
                <div className="bg-violetDark flex h-30 w-full items-center justify-center rounded-xl">
                    Favourite
                </div>
                <div className="bg-violetDark flex h-30 w-full items-center justify-center rounded-xl">
                    Most Popular
                </div>

                {isSuccess &&
                    trendingGifCategoriesData.map(
                        (category: TrendingGifCategory) => (
                            <div
                                key={category.searchTerm}
                                className="bg-violetDark relative h-30 w-full overflow-hidden rounded-xl"
                            >
                                <img
                                    src={category.gifUrl}
                                    alt={category.searchTerm}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-black opacity-45"></div>

                                <span className="absolute inset-0 z-50 flex items-center justify-center text-xl font-semibold text-gray-100">
                                    {category.searchTerm}
                                </span>
                            </div>
                        ),
                    )}
            </div>
        </div>
    );
}
