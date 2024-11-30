import Weather from "../Weather.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import Comments from "./Comments.jsx";

export default function SpotDetails({ spot }) {
  return (
    <div>
      <Weather />
      <PhotoGallery photos={spot.photos} />
      <Comments comments={spot.comments} />
    </div>
  );
}
