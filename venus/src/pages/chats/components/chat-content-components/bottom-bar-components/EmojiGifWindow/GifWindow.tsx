import React, {
    useRef,
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
} from "react";
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
import { ChatMessageToSendDto } from "../../../../../../model/interface/chat/chatInterfaces";
import { useWebSocket } from "../../../../../../stomp/useWebSocket";
import useSelectorTyped from "../../../../../../hooks/useSelectorTyped";
import { notificationAction } from "../../../../../../redux/notification";
import { useDispatch } from "react-redux";

const scrollbarClasses =
    "scrollbar-track-violetLightDarker hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar scrollbar-w-1";

// TODO: create better, gloabl, customizable skeleton
function GifSkeleton() {
    return <div className="h-32 w-full animate-pulse rounded-xl bg-gray-300" />;
}

export default function GifWindow({
    setActiveGifEmojiWindow,
}: {
    setActiveGifEmojiWindow: Dispatch<SetStateAction<"emoji" | "gif" | null>>;
}) {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [searchedInputPhrase, setSearchedInputPhrase] = useState("");
    const dispatch = useDispatch();
    const { selectedChatId } = useSelectorTyped((state) => state.chats);

    const { publish, connected } = useWebSocket();

    function sendMessage(gifUrl: string) {
        if (!connected) return;

        const formatted: ChatMessageToSendDto = {
            chatId: selectedChatId,
            content: gifUrl,
            sentAt: new Date().toISOString(),
        };
        try {
            publish(`/app/send/${selectedChatId}/message`, formatted);
            // TODO: uzyskać potwierdzenie ACK
        } finally {
            console.log("GIF sent successfully:", gifUrl);
            setActiveGifEmojiWindow(null);
        }
    }

    const {
        data: trendingGifCategoriesData,
        isSuccess: isTrendingCategoriesSuccess,
        isLoading: isTrendingCategoriesLoading,
    } = useQuery({
        queryKey: ["trending-gifs-categories"],
        queryFn: () => trendingTenorGifs(),
    });

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

    if (isSearchError) {
        dispatch(
            notificationAction.setError({
                message:
                    "Failed to search gifs by phrase. The error is: " +
                    searchError,
            }),
        );
    }

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

    const allSearchGifs: SearchedGif[] =
        searchPages?.pages.flatMap((p: SearchedGifs) => p.gifs) ?? [];

    // TODO: usprawnic jsx bo jest powielanie iebdzie go ejszcze wiecej (dla zapsianych gifow itd)
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="px-3 py-2">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    className="bg-violetLight w-full rounded-xl p-2"
                    value={searchedInputPhrase}
                    onChange={(e) => setSearchedInputPhrase(e.target.value)}
                />
            </div>

            <div
                className={` ${scrollbarClasses} bg-violetLightDarker mt-2 grid flex-1 grid-cols-2 gap-3 overflow-y-auto rounded-b-xl p-3`}
            >
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

                {isSearchLoading &&
                    searchedInputPhrase &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <GifSkeleton key={i} />
                    ))}

                {isSearchSuccess &&
                    searchedInputPhrase &&
                    allSearchGifs.map((gif: SearchedGif) => (
                        <button
                            key={gif.url}
                            className="group bg-violetDark hover:border-violetLighter relative h-32 w-full cursor-pointer overflow-hidden rounded-xl border border-transparent transition-colors duration-300 ease-in-out"
                            onClick={() => sendMessage(gif.url)}
                        >
                            {/*TODO:take care of alt*/}
                            <img
                                src={gif.url}
                                alt={gif.url}
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
            </div>
        </div>
    );
}
