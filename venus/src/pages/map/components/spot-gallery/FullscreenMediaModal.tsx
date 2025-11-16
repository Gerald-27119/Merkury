import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { IoClose } from "react-icons/io5";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryFullscreenSizeActions } from "../../../../redux/expanded-spot-media-gallery-fullscreen-size";
import { MediaType } from "../../../../model/enum/mediaType";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

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
    //TODO: fix displaying
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
            className="absolute top-0 z-[4] h-full w-full bg-black"
        >
            <IoClose
                onClick={handleCloseFullscreenModal}
                className="text-darkText cursor-pointer text-3xl absolute right-4 top-4 z-5"
            />
            <div className="relative flex h-full items-center justify-center">
                {mediaType === MediaType.PHOTO ? (
                    <img
                        alt={url}
                        src={url}
                        className="max-h-full max-w-full object-contain"
                    />
                ) : (
                    <ReactPlayer
                        controls={true}
                        src={url}
                        style={{
                            width: "100%",
                            height: "100%",
                            aspectRatio: "16/9",
                        }}
                        slot="media"
                    />
                )}
            </div>
        </motion.div>
    );
}
