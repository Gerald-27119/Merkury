import Button from "../../../pages/account/Button.jsx";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { photoAction } from "../../../redux/photo.jsx";
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import Photo from "./Photo.jsx";
import { photoGalleryAction } from "../../../redux/photo-gallery.jsx";
import { useEffect } from "react";

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

  const disabledBtnClasses = "bg-gray-300 border border-red-600 text-zinc-950";
  const activeBtnClasses =
    "bg-neutral-600 text-slate-50 cursor-pointer hover:bg-neutral-400 hover:text-zinc-950";

  return (
    <div className="bg-gray-950 bg-opacity-95 flex justify-center items-center">
      <Button
        onClick={() => dispatch(photoAction.handleMinimizePhoto())}
        classNames="absolute top-2 right-2"
      >
        <IoCloseOutline
          className="text-white bg-red-500 hover:bg-red-700 hover:text-gray-200 mr-6"
          size={20}
        />
      </Button>
      <div className="flex-col">
        <div className="text-xl text-white text-center">
          {currentPhoto.title}
        </div>
        <div className="flex justify-center items-stretch m-1">
          <div className="flex items-center  min-h-full bg-gray-950">
            <RiArrowLeftWideLine
              size={50}
              onClick={() => dispatch(photoGalleryAction.setPreviousPhoto())}
              className={
                currentPhotoIndex === 0 ? disabledBtnClasses : activeBtnClasses
              }
            />
          </div>
          <Photo className="h-[60rem] w-[90rem]" photo={currentPhoto} />
          <div className="flex items-center  min-h-full bg-gray-950">
            <RiArrowRightWideLine
              size={50}
              onClick={() => dispatch(photoGalleryAction.setNextPhoto())}
              className={
                currentPhotoIndex === numberOfPhotos - 1
                  ? disabledBtnClasses
                  : activeBtnClasses
              }
            />
          </div>
        </div>
        <div className="text-lg text-white ml-2">
          Author:&nbsp;{currentPhoto.author}
        </div>
      </div>
    </div>
  );
}
