import PhotoGallery from "../../spot/components/photo-gallery/PhotoGallery.jsx";

export default function SpotProfile({ photos, comments }) {
  return (
    <div className="flex flex-col">
      <PhotoGallery photos={photos} />
    </div>
  );
}
