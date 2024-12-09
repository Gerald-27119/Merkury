import Weather from "./Weather.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import Comments from "./Comments.jsx";
import Info from "./Info.jsx";
import { useSelector } from "react-redux";

export default function SpotDetails() {
  const spot = useSelector((state) => state.spotDetails.spot);
  const expandPhoto = useSelector((state) => state.photo.expandPhoto);

  return (
    <div className="overflow-y-auto h-full w-1/5 absolute left-0 bg-white z-50">
      <Info
        name={spot.name}
        description={spot.description}
        rating={spot.rating}
      />
      <Weather weather={spot.weather} />
      <PhotoGallery photos={spot.photos} />
      <Comments comments={spot.comments} />
    </div>
  );
}
