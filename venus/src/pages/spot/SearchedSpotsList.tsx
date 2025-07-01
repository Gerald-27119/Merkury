import useSelectorTyped from "../../hooks/useSelectorTyped";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import { HiX } from "react-icons/hi";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { searchedSpotListModalAction } from "../../redux/searched-spot-list-modal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchSearchedSpotsPage } from "../../http/spots-data";
import SearchSpotDtoPage from "../../model/interface/spot/searchSpotDtoPage";
import { RootState } from "../../redux/store";
import {
  searchedSpotsSelectors,
  searchedSpotsSliceActions,
} from "../../redux/searched-spots";
import SearchedSpotInfo from "./components/searched-spot/SearchedSpotInfo";
import SearchedSpotsSortingForm from "./components/searched-spot/SearchedSpotsSortingForm";

const slideVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export default function SearchedSpotsList() {
  const isSidebarOpen = useSelectorTyped((state) => state.sidebar.isOpen);
  const dispatch = useDispatchTyped();

  const [pageCount, setPageCount] = useState<number>(0);

  const handleClickCloseList = () => {
    dispatch(searchedSpotListModalAction.handleCloseList());
  };

  const { name, sorting } = useSelectorTyped((state) => state.spotFilters);

  const searchedSpots = useSelectorTyped((state: RootState) =>
    searchedSpotsSelectors.selectAll(state),
  );

  const {
    data,
    isError,
    isLoading,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["spots", name, sorting],
    queryFn: ({ pageParam }) =>
      fetchSearchedSpotsPage(name, pageParam as number, sorting),
    getNextPageParam: (lastPage: SearchSpotDtoPage) => {
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
  });
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuccess && data) {
      const allItems = data.pages.flatMap((s: SearchSpotDtoPage) => s.content);
      dispatch(searchedSpotsSliceActions.upsertSearchedSpots(allItems));
      setPageCount(data.pages.length);
    }
  }, [data, dispatch]);

  useEffect(() => {
    const container = containerRef.current;
    const target = loadMoreRef.current;
    if (!container || !target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(target);
          fetchNextPage();
        }
      },
      {
        root: container,
        rootMargin: "50px",
        threshold: 0,
      },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, pageCount]);

  return (
    <>
      <div
        className={`absolute top-0 z-[5] h-screen w-screen bg-black/85 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      ></div>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideVariants}
        transition={{ duration: 0.3 }}
        className="dark:bg-violetDarker dark:text-darkText absolute top-10 left-0 z-1 flex h-full w-[20rem] flex-col items-center px-6 py-2 text-lg xl:top-0 xl:left-17 xl:w-[30rem] xl:text-xl"
      >
        <HiX
          className="mt-1 ml-auto cursor-pointer text-2xl"
          onClick={handleClickCloseList}
        />
        <h1 className="mb-6 text-xl font-semibold text-white">
          Spots matching criteria
        </h1>
        <SearchedSpotsSortingForm />
        <div
          ref={containerRef}
          className="dark:scrollbar-track-violetDark dark:hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin flex w-full flex-col items-center overflow-y-auto rounded-b-xl lg:h-[80rem] [@media(max-height:1080px)]:h-[50rem]"
        >
          {isLoading && <LoadingSpinner />}
          {isError && <p>Failed to load searched spots data.</p>}
          {searchedSpots?.length === 0 ? (
            <p className="mt-20 text-center text-2xl font-semibold">
              No spots match criteria!
            </p>
          ) : (
            <ul className="w-full">
              {searchedSpots.map((searchedSpot) => (
                <li key={searchedSpot.id} className="my-4">
                  <SearchedSpotInfo spot={searchedSpot} />
                </li>
              ))}
            </ul>
          )}
          {isFetchingNextPage && <LoadingSpinner />}
          <div ref={loadMoreRef} className="h-1" />
        </div>
      </motion.div>
    </>
  );
}
