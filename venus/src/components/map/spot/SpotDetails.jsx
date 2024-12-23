import Weather from "./Weather.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import Comments from "./Comments.jsx";
import Info from "./Info.jsx";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { spotDetailsModalAction } from "../../../redux/spot-modal.jsx";
import ExpandedPhotoGallery from "./ExpandedPhotoGallery.jsx";
import { photoAction } from "../../../redux/photo.jsx";

export default function SpotDetails() {
  const spot = useSelector((state) => state.spotDetails.spot);
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  const expandPhoto = useSelector((state) => state.photo.expandPhoto);
  const dispatch = useDispatch();

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
            rating={spot.rating}
          />
          {/*<Weather weather={spot.weather} />*/}
          <PhotoGallery photos={spot.photos} />
          <div className="overflow-y-auto flex-grow min-h-60">
            <Comments comments={spot.comments} />
          </div>
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
