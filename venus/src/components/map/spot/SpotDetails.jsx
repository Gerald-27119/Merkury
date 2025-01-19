import Weather from "./Weather.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import Comments from "./Comments.jsx";
import CommentForm from "./CommentForm.jsx";
import Info from "./Info.jsx";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { spotDetailsModalAction } from "../../../redux/spot-modal.jsx";
import ExpandedPhotoGallery from "./ExpandedPhotoGallery.jsx";
import { photoAction } from "../../../redux/photo.jsx";
import { fetchSpotsDataById } from "../../../http/spotsData.js";
import { useEffect } from "react";
import { notificationAction } from "../../../redux/notification.jsx";
import fetchWeatherData from "../../../http/weather.js";
import { useQuery } from "@tanstack/react-query";

export default function SpotDetails() {
  const spotId = useSelector((state) => state.spotDetails.spotId);
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  const expandPhoto = useSelector((state) => state.photo.expandPhoto);
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.account.isLogged);

  const { data: spot, error: spotError } = useQuery({
    queryFn: () => fetchSpotsDataById(spotId),
    queryKey: ["spotDetails", spotId],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useQuery({
    queryFn: () =>
      fetchWeatherData(
        spot.weatherApiCallCoords[0],
        spot.weatherApiCallCoords[1],
      ),
    queryKey: ["weather", spotId],
    enabled: !!spot,
  });

  let error = spotError || weatherError;

  useEffect(() => {
    if (error?.response?.data) {
      dispatch(
        notificationAction.setError({
          message: error.response.data,
        }),
      );
    }
  }, [dispatch, error]);

  return (
    <div className="w-full h-full absolute flex">
      <div
        className={`h-full w-1/5 bg-white z-50 overflow-y-auto ${
          showDetailsModal && "animate-slideInFromLeft"
        }`}
      >
        {spot && (
          <div className="mx-3 flex flex-col h-full">
            <div className="flex justify-end mt-3">
              <IoCloseOutline
                size={20}
                className="cursor-pointer text-black hover:bg-red-500 hover:rounded-md hover:text-white"
                onClick={() => {
                  dispatch(spotDetailsModalAction.handleCloseModal());
                  dispatch(photoAction.handleMinimizePhoto());
                }}
              />
            </div>
            <Info
              name={spot.name}
              description={spot.description}
              rating={spot.rating}
            />
            {weatherLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Weather weather={weather} />
            )}
            <PhotoGallery photos={spot.photos} />
            <div className="overflow-y-auto flex-grow min-h-60">
              <Comments spotId={spotId} />
            </div>
            {isLogged && (
              <div>
                <CommentForm spotId={spotId} />
              </div>
            )}
          </div>
        )}
      </div>
      {expandPhoto && (
        <div className="flex-grow h-full z-50">
          <ExpandedPhotoGallery photos={spot.photos} />
        </div>
      )}
    </div>
  );
}
