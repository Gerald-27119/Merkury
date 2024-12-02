import { RiArrowLeftWideLine } from "react-icons/ri";
import { RiArrowRightWideLine } from "react-icons/ri";
import Photo from "./Photo.jsx";
import { useState } from "react";

let currentPhotoIndex = 0;
export default function PhotoGallery({ photos }) {
  const numberOfPhotos = photos.length;
  const [currentPhoto, setCurrentPhoto] = useState(photos[currentPhotoIndex]);

  const handleNextPhoto = () => {
    if (currentPhotoIndex < numberOfPhotos) {
      currentPhotoIndex++;
      setCurrentPhoto(photos[currentPhotoIndex]);
    }
  };

  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      currentPhotoIndex--;
      setCurrentPhoto(photos[currentPhotoIndex]);
    }
  };

  return (
    <>
      {/*items-stretch w rodzicu*/}
      {(photos && photos.length) > 0 ? (
        <div className="flex justify-center items-stretch border m-1">
          <div>
            <RiArrowLeftWideLine size={15} onClick={handlePreviousPhoto} />
          </div>
          <div>
            <Photo photo={currentPhoto} />
          </div>
          <div className="flex items-center  min-h-full bg-gray-950">
            <RiArrowRightWideLine size={15} onClick={handleNextPhoto} />
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
