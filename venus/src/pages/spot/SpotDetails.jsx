import Weather from "./components/weather/Weather.jsx";
import PhotoGallery from "./components/photo-gallery/PhotoGallery.jsx";
import Comments from "./components/comments/Comments.jsx";
import SpotGeneralInfo from "./components/general-info/SpotGeneralInfo.jsx";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { spotDetailsModalAction } from "../../redux/spot-modal.jsx";
import ExpandedPhotoGallery from "./components/photo-gallery/ExpandedPhotoGallery.jsx";
import { photoAction } from "../../redux/photo.jsx";
import { fetchSpotsDataById } from "../../http/spots-data.js";
import { useEffect } from "react";
import { notificationAction } from "../../redux/notification.jsx";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";
import AddToFavouritesButton from "./components/buttons/AddToFavouritesButton.jsx";

export default function SpotDetails() {
  const spotId = useSelector((state) => state.spotDetails.spotId);
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  const expandPhoto = useSelector((state) => state.photo.expandPhoto);
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.account.isLogged);

  const { data, error, isLoading } = useQuery({
    queryFn: () => fetchSpotsDataById(spotId),
    queryKey: ["spotDetails", spotId],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (error?.response?.data) {
      dispatch(
        notificationAction.setError({
          message: error.response.data,
        }),
      );
    }
  }, [dispatch, error]);

  const handleClickCloseModal = () => {
    dispatch(spotDetailsModalAction.handleCloseModal());
    dispatch(photoAction.handleMinimizePhoto());
  };

  return (
    <div className="w-full h-full absolute flex">
      <div
        className={`h-full w-1/5 bg-white z-50 overflow-y-auto ${
          showDetailsModal && "animate-slideInFromLeft"
        }`}
      >
        {isLoading && <LoadingSpinner />}
        {data && (
          <div className="mx-3 flex flex-col h-full">
            <div className="flex justify-end mt-3">
              <IoCloseOutline
                size={20}
                className="cursor-pointer text-black hover:bg-red-500 hover:rounded-md hover:text-white"
                onClick={handleClickCloseModal}
              />
            </div>
            <SpotGeneralInfo
              name={data.name}
              description={data.description}
              rating={data.rating}
            />
            {isLogged && <AddToFavouritesButton spotId={spotId} />}
            <Weather spot={data} />
            <PhotoGallery photos={data.photos} />
            <div className="overflow-y-auto flex-grow min-h-60">
              <Comments spotId={spotId} />
            </div>
          </div>
        )}
      </div>
      {expandPhoto && (
        <div className="flex-grow h-full z-50">
          <ExpandedPhotoGallery photos={data.photos} />
        </div>
      )}
    </div>
  );
}
