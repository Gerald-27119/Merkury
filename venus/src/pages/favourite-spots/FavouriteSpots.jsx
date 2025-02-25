import { useQuery } from "@tanstack/react-query";
import { fetchUserFavouriteSpots } from "../../http/spots-data.js";
import FavouriteSpot from "./FavouriteSpot.jsx";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import Error from "../../components/error/Error.jsx";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";

export default function FavouriteSpots() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, error, isLoading, isSuccess } = useQuery({
    queryFn: () => fetchUserFavouriteSpots(currentPage),
    queryKey: ["favouriteSpots", currentPage],
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });

  const handlePageAfterRemove = () => {
    if (data && data.content.length === 1 && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="h-screen bg-[url('/bg-form.png')] bg-cover bg-no-repeat bg-center flex items-center justify-center w-screen">
      <div className="bg-amber-400 w-[30rem] rounded-md px-10 py-8 flex flex-col h-full justify-center">
        <h1 className="text-center text-2xl text-white font-bold pb-8">
          Your favourite spots
        </h1>

        {isLoading && <LoadingSpinner />}
        {error && <Error error={error} />}
        {isSuccess &&
          (data.content?.length > 0 ? (
            <>
              <ul>
                {data.content.map((spot) => (
                  <li key={spot.id}>
                    <FavouriteSpot
                      spot={spot}
                      currentPage={currentPage}
                      onRemove={handlePageAfterRemove}
                    />
                  </li>
                ))}
              </ul>

              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={data.totalPages}
                initialPage={currentPage}
                marginPagesDisplayed={1}
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
          ))}
      </div>
    </div>
  );
}
