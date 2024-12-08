import Weather from "./Weather.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import Comments from "./Comments.jsx";

export default function SpotDetails({ spot }) {
  return (
    <div className="overflow-y-auto h-96">
      <Weather weather={spot.weather} />
      <PhotoGallery photos={spot.photos} />
      <Comments comments={spot.comments} />
    </div>
  );
}
