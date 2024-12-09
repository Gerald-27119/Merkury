import { RiArrowLeftWideLine } from "react-icons/ri";
import { RiArrowRightWideLine } from "react-icons/ri";
import Photo from "./Photo.jsx";
import { useEffect, useState } from "react";
import ExpandedPhoto from "./ExpandedPhoto.jsx";
import { useDispatch, useSelector } from "react-redux";
import { photoAction } from "../../../redux/photo.jsx";

export default function PhotoGallery({ photos }) {
  const dispatch = useDispatch();

  const expandPhoto = useSelector((state) => state.photo.expandPhoto);

  const disabledBtnClasses = "bg-gray-300 border border-red-600 text-zinc-950";
  const activeBtnClasses =
    "bg-neutral-600 text-slate-50 cursor-pointer hover:bg-neutral-400 hover:text-zinc-950";

  const numberOfPhotos = photos.length;

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [disableButton, setDisableButton] = useState({
    previousBtn: true,
    nextBtn: false,
  });

  useEffect(() => {
    setDisableButton({
      previousBtn: currentPhotoIndex === 0,
      nextBtn: currentPhotoIndex === numberOfPhotos - 1,
    });
  }, [currentPhotoIndex]);

  const handleNextPhoto = () => {
    if (currentPhotoIndex < numberOfPhotos - 1) {
      setCurrentPhotoIndex((prevState) => prevState + 1);
    }
  };

  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prevState) => prevState - 1);
    }
  };
  console.log(expandPhoto);
  return (
    <>
      {expandPhoto && (
        <ExpandedPhoto
          author={photos[currentPhotoIndex].author}
          title={photos[currentPhotoIndex].title}
        >
          <div className="flex justify-center items-stretch m-1">
            <div className="flex items-center  min-h-full bg-gray-950">
              <RiArrowLeftWideLine
                size={50}
                onClick={handlePreviousPhoto}
                className={
                  disableButton.previousBtn
                    ? disabledBtnClasses
                    : activeBtnClasses
                }
              />
            </div>
            <Photo
              className="h-[60rem] w-[90rem]"
              photo={photos[currentPhotoIndex]}
            />
            <div className="flex items-center  min-h-full bg-gray-950">
              <RiArrowRightWideLine
                size={50}
                onClick={handleNextPhoto}
                className={
                  disableButton.nextBtn ? disabledBtnClasses : activeBtnClasses
                }
              />
            </div>
          </div>
        </ExpandedPhoto>
      )}
      {photos && photos.length > 0 ? (
        <div className="flex justify-center items-stretch border my-1.5">
          <div className="flex items-center  min-h-full bg-gray-950 flex-grow justify-center">
            <RiArrowLeftWideLine
              size={25}
              onClick={handlePreviousPhoto}
              className={
                disableButton.previousBtn
                  ? disabledBtnClasses
                  : activeBtnClasses
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
              onClick={handleNextPhoto}
              className={
                disableButton.nextBtn ? disabledBtnClasses : activeBtnClasses
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
