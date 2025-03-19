import PhotoGallery from "../../spot/components/photo-gallery/PhotoGallery.jsx";
import Comments from "../../spot/components/comments/Comments.jsx";
import { useSelector } from "react-redux";
import SpotPhotoCarousel from "./SpotPhotoCarousel.jsx";

export default function SpotProfile({ photos, spotId }) {
  const isLogged = useSelector((state) => state.account.isLogged);
  return (
    <div className="flex flex-col items-center">
      <SpotPhotoCarousel photos={photos} />
      {/*<PhotoGallery photos={photos} />*/}
      <Comments spotId={spotId} isUserLoggedIn={isLogged} />
    </div>
  );
}
