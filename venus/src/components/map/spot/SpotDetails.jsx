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
import { useMemo } from "react";

export default function SpotDetails() {
  const spot = useSelector((state) => state.spotDetails.spot);
  const spotId = spot.id;
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  const expandPhoto = useSelector((state) => state.photo.expandPhoto);
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.account.isLogged);

  const averageRating = useMemo(() => {
    return spot.comments.length > 0
      ? spot.comments.reduce((sum, comment) => sum + comment.rating, 0) /
          spot.comments.length
      : 0;
  }, [spot.comments]);

  return (
    <div className="w-full h-full absolute flex">
      <div
        className={`h-full w-1/5 bg-white z-50 overflow-y-auto ${
          showDetailsModal && "animate-slideInFromLeft"
        }`}
      >
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
            rating={averageRating}
          />
          <Weather weather={spot.weather} />
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
      </div>
      {expandPhoto && (
        <div className="flex-grow h-full z-50">
          <ExpandedPhotoGallery photos={spot.photos} />
        </div>
      )}
    </div>
  );
}
