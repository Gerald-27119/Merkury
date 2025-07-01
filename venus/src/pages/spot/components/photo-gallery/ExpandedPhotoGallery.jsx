import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { photoAction } from "../../../../redux/photo.jsx";
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import Photo from "./Photo.tsx";
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
        <div className="bg-opacity-95 flex h-full items-center justify-center bg-gray-950">
            <button
                onClick={handleClickMinimizePhoto}
                className="absolute top-2 right-2"
            >
                <IoCloseOutline
                    className="mt-4 mr-6 rounded-xs bg-red-500 text-white hover:bg-red-700 hover:text-gray-200"
                    size={20}
                />
            </button>
            <div className="flex-col">
                <p className="mb-4 text-center text-2xl font-semibold text-white">
                    {currentPhoto.title}
                </p>
                <div className="m-1 flex items-stretch justify-center">
                    <Photo
                        className="h-[60rem] w-[90rem] md:h-[30rem] md:w-[60rem]"
                        photo={currentPhoto}
                    />
                </div>
                <p className="ml-2 text-lg text-white">
                    Author:&nbsp;{currentPhoto.author}
                </p>
                <div className="flex justify-center space-x-24">
                    <div className="flex items-center">
                        <RiArrowLeftWideLine
                            size={50}
                            onClick={handleClickPreviousPhoto}
                            className={
                                currentPhotoIndex === 0
                                    ? disabledBtnClasses
                                    : activeBtnClasses
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
