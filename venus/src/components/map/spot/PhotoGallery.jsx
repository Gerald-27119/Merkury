import { RiArrowLeftWideLine } from "react-icons/ri";
import { RiArrowRightWideLine } from "react-icons/ri";
import Photo from "./Photo.jsx";
import { useDispatch, useSelector } from "react-redux";
import { photoAction } from "../../../redux/photo.jsx";
import { photoGalleryAction } from "../../../redux/photo-gallery.jsx";
import { useEffect } from "react";

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

  const disabledBtnClasses = "bg-gray-300 border border-red-600 text-zinc-950";
  const activeBtnClasses =
    "bg-neutral-600 text-slate-50 cursor-pointer hover:bg-neutral-400 hover:text-zinc-950";

  return (
    <>
      {photos && photos.length > 0 ? (
        <div className="flex justify-center items-stretch border my-1.5">
          <div className="flex items-center  min-h-full bg-gray-950 flex-grow justify-center">
            <RiArrowLeftWideLine
              size={25}
              onClick={() => dispatch(photoGalleryAction.setPreviousPhoto())}
              className={
                currentPhotoIndex === 0 ? disabledBtnClasses : activeBtnClasses
              }
            />
          </div>
          <Photo
            className="h-56 w-96 cursor-pointer"
            photo={photos[currentPhotoIndex]}
            onClick={() => dispatch(photoAction.handleExpandPhoto())}
          />
          <div className="flex items-center min-h-full bg-gray-950 flex-grow justify-center">
            <RiArrowRightWideLine
              size={25}
              onClick={() => dispatch(photoGalleryAction.setNextPhoto())}
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
          <div className="text-lg text-center">
            There are no photos for this spot.
          </div>
        </div>
      )}
    </>
  );
}
