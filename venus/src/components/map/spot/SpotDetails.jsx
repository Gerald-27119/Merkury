import Weather from "./Weather.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import Comments from "./Comments.jsx";
import Info from "./Info.jsx";
import { useSelector } from "react-redux";

export default function SpotDetails() {
  const spot = useSelector((state) => state.spotDetails.spot);

  return (
    <div className="h-full w-1/5 absolute left-0 bg-white z-50">
      <div className="mx-3 flex flex-col h-full">
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
