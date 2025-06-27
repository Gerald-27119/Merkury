import useSelectorTyped from "../../hooks/useSelectorTyped";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import { HiX } from "react-icons/hi";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { searchedSpotListModalAction } from "../../redux/searched-spot-list-modal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { fetchSearchedSpotsPage } from "../../http/spots-data";
import SearchSpotDtoPage from "../../model/interface/spot/searchSpotDtoPage";
import { RootState } from "../../redux/store";
import { searchedSpotsSelectors } from "../../redux/searched-spots";

const slideVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export default function SearchedSpots() {
  const isSidebarOpen = useSelectorTyped((state) => state.sidebar.isOpen);
  const dispatch = useDispatchTyped();

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
        className="dark:bg-violetDarker dark:text-darkText absolute top-10 left-0 z-1 flex h-full w-[20rem] flex-col items-center p-2 text-lg xl:top-0 xl:left-17 xl:w-[35rem] xl:text-xl"
      >
        <HiX className="cursor-pointer" onClick={handleClickCloseList} />
        <h1>Spots matching criteria</h1>
        {isLoading && <LoadingSpinner />}
        {isError && <p>Failed to load searched spots data.</p>}
        {/*TODO: */}
        {/*<SearchedSpotsSortingForm />*/}
        {searchedSpots?.length ? (
          <p className="mt-20 text-center text-2xl font-semibold">
            No spots match criteria!
          </p>
        ) : (
          <ul>
            {searchedSpots.map((searchedSpot) => (
              <li key={searchedSpot.id}>
                {/*TODO*/}
                <p>spot</p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </>
  );
}
