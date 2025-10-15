import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { IoClose } from "react-icons/io5";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryFullscreenSizeActions } from "../../../../redux/expanded-spot-media-gallery-fullscreen-size";
import { MediaType } from "../../../../model/enum/mediaType";
import { motion } from "framer-motion";

//TODO add video display

const slideVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function FullscreenMediaModal() {
    const { url, mediaType } = useSelectorTyped(
        (state) => state.expandedSpotGalleryCurrentMedia,
    );

    const dispatch = useDispatchTyped();

    const handleCloseFullscreenModal = () => {
        dispatch(expandedSpotMediaGalleryFullscreenSizeActions.setNormalSize());
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
            className="absolute top-0 z-[4] flex h-full w-full flex-col items-center bg-black"
        >
            <IoClose
                onClick={handleCloseFullscreenModal}
                className="text-darkText mt-2 ml-auto cursor-pointer text-2xl"
            />
            <div className="flex h-full items-center">
                {mediaType === MediaType.PHOTO ? (
                    <img
                        alt={url}
                        src={url}
                        className="max-h-full max-w-full"
                    />
                ) : (
                    <p>video</p>
                )}
            </div>
        </motion.div>
    );
}
