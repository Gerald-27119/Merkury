import Weather from "./components/weather/Weather.jsx";
import PhotoGallery from "./components/photo-gallery/PhotoGallery.jsx";
import Comments from "./components/comments/Comments.jsx";
import SpotGeneralInfo from "./components/general-info/SpotGeneralInfo.js";
import { spotDetailsModalAction } from "../../redux/spot-modal";
import ExpandedPhotoGallery from "./components/photo-gallery/ExpandedPhotoGallery.jsx";
import { photoAction } from "../../redux/photo.jsx";
import { fetchSpotsDataById } from "../../http/spots-data.js";
import { useEffect } from "react";
import { notificationAction } from "../../redux/notification.jsx";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";
import AddToFavouritesButton from "./components/buttons/AddToFavouritesButton.jsx";
import AddCommentForm from "./components/comments/AddCommentForm.jsx";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import useSelectorTyped from "../../hooks/useSelectorTyped";
import { AxiosError } from "axios";
import { HiX } from "react-icons/hi";

export default function SpotDetails() {
  const spotId = useSelectorTyped((state) => state.spotDetails.spotId);
  const showDetailsModal = useSelectorTyped(
    (state) => state.spotDetails.showModal,
  );
  const expandPhoto = useSelectorTyped((state) => state.photo.expandPhoto);
  const dispatch = useDispatchTyped();
  const isLogged = useSelectorTyped((state) => state.account.isLogged);

  const { data, error, isLoading } = useQuery({
    queryFn: () => fetchSpotsDataById(spotId),
    queryKey: ["spotDetails", spotId],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if ((error as AxiosError)?.response?.data) {
      dispatch(
        notificationAction.setError({
          message: (error as AxiosError)?.response?.data,
        }),
      );
    }
  }, [dispatch, error]);

  const handleClickCloseModal = () => {
    dispatch(spotDetailsModalAction.handleCloseModal());
  };

  return (
    <div className="absolute flex h-full w-full">
      <div
        className={`h-full w-1/5 overflow-y-auto bg-white ${
          showDetailsModal && "animate-slideInFromLeft"
        }`}
      >
        {isLoading && <LoadingSpinner />}
        {data && (
          <div className="mx-3 flex h-full flex-col">
            <div className="mt-3 flex justify-end">
              <HiX
                size={20}
                className="cursor-pointer text-black hover:rounded-md hover:bg-red-500 hover:text-white"
                onClick={handleClickCloseModal}
              />
            </div>
            <SpotGeneralInfo
              name={data.name}
              country={data.country}
              city={data.city}
              street={data.street}
              description={data.description}
              rating={data.rating}
              ratingCount={data.ratingCount}
              tags={data.tags}
            />
          </div>
        )}
      </div>
    </div>
  );
}
