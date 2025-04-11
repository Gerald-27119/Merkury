import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import Photo from "./Photo.jsx";
import { useDispatch, useSelector } from "react-redux";
import { photoAction } from "../../../../redux/photo.jsx";
import { photoGalleryAction } from "../../../../redux/photo-gallery.jsx";
import { useEffect } from "react";

const disabledBtnClasses = "bg-gray-300 border border-red-600 text-zinc-950";
const activeBtnClasses =
  "bg-neutral-600 text-slate-50 cursor-pointer hover:bg-neutral-400 hover:text-zinc-950";

export default function PhotoGallery({ photos }) {
  const dispatch = useDispatch();

  const currentPhotoIndex = useSelector(
    (state) => state.photoGallery.currentPhotoIndex,
  );

  const numberOfPhotos = useSelector(
    (state) => state.photoGallery.numberOfPhotos,
  );

  useEffect(() => {
    dispatch(photoGalleryAction.setNumberOfPhotos(photos.length));
  }, [photos]);

  const handleClickPreviousPhoto = () => {
    dispatch(photoGalleryAction.setPreviousPhoto());
  };

  const handleClickExpandPhoto = () => {
    dispatch(photoAction.handleExpandPhoto());
  };

  const handleClickNextPhoto = () => {
    dispatch(photoGalleryAction.setNextPhoto());
  };

  return (
    <>
      {photos && photos.length > 0 ? (
        <div className="my-1.5 flex items-stretch justify-center border">
          <div className="flex min-h-full grow items-center justify-center bg-gray-950">
            <RiArrowLeftWideLine
              size={25}
              onClick={handleClickPreviousPhoto}
              className={
                currentPhotoIndex === 0 ? disabledBtnClasses : activeBtnClasses
              }
            />
          </div>
          <Photo
            className="h-56 w-96 cursor-pointer md:h-40"
            photo={photos[currentPhotoIndex]}
            onClick={handleClickExpandPhoto}
          />
          <div className="flex min-h-full grow items-center justify-center bg-gray-950">
            <RiArrowRightWideLine
              size={25}
              onClick={handleClickNextPhoto}
              className={
                currentPhotoIndex === numberOfPhotos - 1
                  ? disabledBtnClasses
                  : activeBtnClasses
              }
            />
          </div>
        </div>
      ) : (
        <div className="my-1 rounded-xs border border-orange-500">
          <p className="text-center text-lg">
            There are no photos for this spot.
          </p>
        </div>
      )}
    </>
  );
}
