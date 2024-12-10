import Weather from "./Weather.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import Comments from "./Comments.jsx";
import Info from "./Info.jsx";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { spotDetailsModalAction } from "../../../redux/spot-modal.jsx";

export default function SpotDetails() {
  const spot = useSelector((state) => state.spotDetails.spot);
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  const dispatch = useDispatch();

  return (
    <div
      className={`h-full w-1/5 absolute left-0 bg-white z-50 ${
        showDetailsModal ? "animate-slideInFromLeft" : undefined
      }`}
    >
      <div className="mx-3 flex flex-col h-full">
        <div className="flex justify-end mt-3">
          <IoCloseOutline
            size={20}
            className="cursor-pointer text-black hover:bg-red-500 hover:rounded-md hover:text-white"
            onClick={() => dispatch(spotDetailsModalAction.handleCloseModal())}
          />
        </div>
        <Info
          name={spot.name}
          description={spot.description}
          rating={spot.rating}
        />
        <Weather weather={spot.weather} />
        <PhotoGallery photos={spot.photos} />
        <div className="overflow-y-auto flex-grow">
          <Comments comments={spot.comments} />
        </div>
      </div>
    </div>
  );
}
