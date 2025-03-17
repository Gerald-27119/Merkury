import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import Photo from "./Photo.jsx";
import { useDispatch, useSelector } from "react-redux";
import { photoAction } from "../../../../redux/photo.jsx";
import { photoGalleryAction } from "../../../../redux/photo-gallery.jsx";
import { useEffect } from "react";

const disabledBtnClasses =
  "bg-gray-300 border border-red-600 text-zinc-950 rounded-full";
const activeBtnClasses =
  "text-slate-50 cursor-pointer invisible group-hover:visible";

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
        <div className="flex justify-center items-stretch border my-1.5">
          <div className="flex items-center min-h-full bg-gray-900 flex-grow justify-center group">
            <BsChevronCompactLeft
              size={50}
              onClick={handleClickPreviousPhoto}
              className={
                currentPhotoIndex === 0 ? disabledBtnClasses : activeBtnClasses
              }
            />
          </div>
          <Photo
            className="h-80 w-96 cursor-pointer"
            photo={photos[currentPhotoIndex]}
            onClick={handleClickExpandPhoto}
          />
          <div className="flex items-center min-h-full bg-gray-900 flex-grow justify-center group">
            <BsChevronCompactRight
              size={50}
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
        <div className="border rounded-sm border-orange-500 my-1">
          <p className="text-lg text-center">
            There are no photos for this spot.
          </p>
        </div>
      )}
    </>
  );
}
