import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserFavouriteSpots,
  removeSpotFromFavourites,
} from "../../http/spotsData.js";
import FavouriteSpot from "../../components/map/spot/FavouriteSpot.jsx";
import MainContainer from "../../components/MainContainer.jsx";
import { useState } from "react";
import ReactPaginate from "react-paginate";

export default function FavouriteSpots() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const { data, error, isLoading } = useQuery({
    queryFn: () => fetchUserFavouriteSpots(currentPage),
    queryKey: ["favouriteSpots", currentPage],
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });

  const mutationRemove = useMutation({
    mutationFn: removeSpotFromFavourites,
  });

  const handleRemove = async (spotId) => {
    try {
      await mutationRemove.mutateAsync(spotId);
      await queryClient.invalidateQueries("favouriteSpots");
    } catch (error) {
      console.log("Error removing spot from favourites:", error);
    }
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <MainContainer>
      <h1 className="text-center text-2xl text-white font-bold pb-8">
        Your favourite spots
      </h1>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading favourite spots</div>}

      {!isLoading && data && data.content.length > 0 ? (
        <>
          <ul>
            {data.content.map((spot) => (
              <li key={spot.id}>
                <FavouriteSpot spot={spot} handleRemove={handleRemove} />
              </li>
            ))}
          </ul>

          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={data.totalPages}
            initialPage={currentPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="flex justify-center items-center space-x-2 mt-6"
            pageLinkClassName="px-4 py-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900"
            activeLinkClassName="!bg-blue-500 !text-white !border-blue-500"
            nextLinkClassName="px-4 py-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900"
            previousLinkClassName="px-4 py-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900"
            disabledLinkClassName="opacity-50 cursor-not-allowed"
          />
        </>
      ) : (
        <p className="text-center">No spots available</p>
      )}
    </MainContainer>
  );
}
