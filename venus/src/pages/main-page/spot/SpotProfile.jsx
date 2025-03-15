import PhotoGallery from "../../spot/components/photo-gallery/PhotoGallery.jsx";
import { TfiMapAlt } from "react-icons/tfi";

export default function SpotProfile({ photos, comments }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 cursor-pointer justify-end mr-3.5 w-fit ml-auto">
        <span className="text-lg">See on the map</span>
        <TfiMapAlt size={30} />
      </div>
      <PhotoGallery photos={photos} />
    </div>
  );
}
