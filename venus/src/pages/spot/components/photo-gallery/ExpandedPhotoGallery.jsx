import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { photoAction } from "../../../../redux/photo.jsx";
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import Photo from "./Photo.jsx";
import { photoGalleryAction } from "../../../../redux/photo-gallery.jsx";
import { useEffect } from "react";

const disabledBtnClasses =
  "bg-gray-300 border border-red-600 text-zinc-950 rounded-full";
const activeBtnClasses =
  "bg-neutral-600 text-slate-50 cursor-pointer hover:bg-neutral-400 hover:text-zinc-950 rounded-full";

export default function ExpandedPhotoGallery({ photos }) {
  const dispatch = useDispatch();

  const currentPhotoIndex = useSelector(
    (state) => state.photoGallery.currentPhotoIndex,
  );

  const numberOfPhotos = useSelector(
    (state) => state.photoGallery.numberOfPhotos,
  );

  let currentPhoto = photos[currentPhotoIndex];

  useEffect(() => {
    currentPhoto = photos[currentPhotoIndex];
  }, [currentPhotoIndex, photos]);

  const handleClickMinimizePhoto = () => {
    dispatch(photoAction.handleMinimizePhoto());
  };

  const handleClickPreviousPhoto = () => {
    dispatch(photoGalleryAction.setPreviousPhoto());
  };

  const handleClickNextPhoto = () => {
    dispatch(photoGalleryAction.setNextPhoto());
  };

  return (
    <div className="bg-gray-950 bg-opacity-95 flex justify-center items-center h-full">
      <button
        onClick={handleClickMinimizePhoto}
        className="absolute top-2 right-2"
      >
        <IoCloseOutline
          className="text-white bg-red-500 hover:bg-red-700 hover:text-gray-200 mr-6 rounded-xs mt-4"
          size={20}
        />
      </button>
      <div className="flex-col">
        <p className="text-2xl text-white text-center font-semibold mb-4">
          {currentPhoto.title}
        </p>
        <div className="flex justify-center items-stretch m-1">
          <Photo
            className="h-[60rem] w-[90rem] md:h-[30rem] md:w-[60rem]"
            photo={currentPhoto}
          />
        </div>
        <p className="text-lg text-white ml-2">
          Author:&nbsp;{currentPhoto.author}
        </p>
        <div className="flex justify-center space-x-24">
          <div className="flex items-center">
            <RiArrowLeftWideLine
              size={50}
              onClick={handleClickPreviousPhoto}
              className={
                currentPhotoIndex === 0 ? disabledBtnClasses : activeBtnClasses
              }
            />
          </div>
          <div className="flex items-center">
            <RiArrowRightWideLine
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
      </div>
    </div>
  );
}
