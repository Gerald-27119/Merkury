import React, { useRef, useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
    searchTenorGifs,
    trendingTenorGifs,
} from "../../../../../../http/gifs";
import {
    SearchedGif,
    SearchedGifs,
    TrendingGifCategory,
} from "../../../../../../model/interface/chat/gifs/gifInterfaces";

// Prosty skeleton – możesz podmienić na swój komponent
function GifSkeleton() {
    return <div className="h-32 w-full animate-pulse rounded-xl bg-gray-300" />;
}

export default function GifWindow() {
    const [searchedInputPhrase, setSearchedInputPhrase] = useState("");

    // 1) Pobranie trendujących kategorii
    const {
        data: trendingGifCategoriesData,
        isSuccess: isTrendingCategoriesSuccess,
        isLoading: isTrendingCategoriesLoading,
    } = useQuery({
        queryKey: ["trending-gifs-categories"],
        queryFn: () => trendingTenorGifs(),
    });

    // 2) Paginowany fetch GIF-ów po frazie
    const {
        data: searchPages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isSearchLoading,
        isSuccess: isSearchSuccess,
        isError: isSearchError,
        error: searchError,
    } = useInfiniteQuery<SearchedGifs, Error>({
        queryKey: ["searched-gifs", searchedInputPhrase],
        queryFn: ({ pageParam = "" }) =>
            searchTenorGifs(searchedInputPhrase, pageParam as string),
        getNextPageParam: (lastPage) => lastPage.next,
        initialPageParam: "",
        enabled: searchedInputPhrase.length > 0,
    });

    // 3) Ref do elementu doklejającego
    const loadMoreRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage) return;
        const obs = new IntersectionObserver(
            ([entry], observer) => {
                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    observer.unobserve(entry.target);
                    fetchNextPage();
                }
            },
            { rootMargin: "200px" },
        );
        obs.observe(loadMoreRef.current);
        return () => obs.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // 4) Spłaszczamy wszystkie strony do jednej listy GIF-ów
    const allSearchGifs: SearchedGif[] =
        searchPages?.pages.flatMap((p: SearchedGifs) => p.gifs) ?? [];

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* --- Pasek wyszukiwania --- */}
            <div className="px-3 py-2">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    className="bg-violetLight w-full rounded-xl p-2"
                    value={searchedInputPhrase}
                    onChange={(e) => setSearchedInputPhrase(e.target.value)}
                />
            </div>

            {/* --- Kontener GIF-ów --- */}
            <div className="bg-violetLightDarker scrollbar-track-violetLightDarker hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-w-1 mt-2 grid flex-1 grid-cols-2 gap-3 overflow-auto rounded-b-xl p-3">
                {/* W pierwszym ładowaniu trendujące skeletony */}

                {isTrendingCategoriesLoading &&
                    !searchedInputPhrase &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <GifSkeleton key={i} />
                    ))}
                <div className="bg-violetDark flex h-30 w-full items-center justify-center rounded-xl">
                    Favourite
                </div>
                <div className="bg-violetDark flex h-30 w-full items-center justify-center rounded-xl">
                    Most Popular
                </div>

                {/* Trendujące kategorie */}
                {isTrendingCategoriesSuccess &&
                    !searchedInputPhrase &&
                    trendingGifCategoriesData.map(
                        (cat: TrendingGifCategory) => (
                            <button
                                key={cat.searchTerm}
                                onClick={() =>
                                    setSearchedInputPhrase(cat.searchTerm)
                                }
                                className="group bg-violetDark hover:border-violetLighter relative h-32 w-full cursor-pointer overflow-hidden rounded-xl border border-transparent transition-colors duration-300 ease-in-out"
                            >
                                <img
                                    src={cat.gifUrl}
                                    alt={cat.searchTerm}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                                <div className="pointer-events-none absolute inset-0 z-20 bg-black opacity-45 transition-opacity duration-300 group-hover:opacity-65" />
                                <span className="absolute inset-0 z-50 flex items-center justify-center text-xl font-semibold text-gray-100">
                                    {cat.searchTerm}
                                </span>
                            </button>
                        ),
                    )}

                {/* --- Wyniki wyszukiwania --- */}

                {/* Skeleton podczas pierwszego ładowania wyników */}
                {isSearchLoading &&
                    searchedInputPhrase &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <GifSkeleton key={i} />
                    ))}

                {/* Gify po frazie */}
                {isSearchSuccess &&
                    searchedInputPhrase &&
                    allSearchGifs.map((gif: SearchedGif) => (
                        <button
                            key={gif.url}
                            className="group bg-violetDark hover:border-violetLighter relative h-32 w-full cursor-pointer overflow-hidden rounded-xl border border-transparent transition-colors duration-300 ease-in-out"
                        >
                            <img
                                src={gif.url}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}

                {hasNextPage && (
                    <div ref={loadMoreRef} className="col-span-2 h-1" />
                )}

                {isFetchingNextPage && (
                    <div className="col-span-2 flex justify-center py-2">
                        <p>Loading more gifs</p>
                    </div>
                )}

                {isSearchError && (
                    <div className="col-span-2 text-center text-red-500">
                        Something went wrong while searching GIFs. Error:
                        {searchError?.message}
                    </div>
                )}
            </div>
        </div>
    );
}
