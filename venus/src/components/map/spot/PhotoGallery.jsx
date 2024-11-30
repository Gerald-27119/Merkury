export default function PhotoGallery({ photos }) {
  return (
    <>
      {(photos && photos.length) > 0 ? (
        <span>Photos available</span>
      ) : (
        <div className="border rounded-sm border-orange-500 my-1">
          <div className="text-lg text-center">
            There are no photos for this spot.
          </div>
        </div>
      )}
    </>
  );
}
