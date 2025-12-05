import ExpandedGallerySidebar from "./components/expanded-gallery-sidebar/ExpandedGallerySidebar";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { motion } from "framer-motion";
import ExpandedMediaDisplay from "./components/expanded-media-display/ExpandedMediaDisplay";
import ExpandedMediaGalleryActions from "./components/ExpandedMediaGalleryActions";

const slideVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
};

export default function ExpandedSpotMediaGallery() {
    const isSidebarOpen = useSelectorTyped((state) => state.sidebar.isOpen);

    return (
        <>
            <div
                className={`absolute top-0 z-[5] h-screen w-screen bg-black/85 transition-opacity duration-300 ${
                    isSidebarOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            ></div>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.3 }}
                className="text-darkText absolute top-10 left-0 z-[3] flex h-full w-full overflow-y-auto text-lg xl:top-0 xl:left-17 xl:text-xl"
            >
                <ExpandedGallerySidebar />
                <div className="relative z-[3] flex h-full w-full items-center justify-center bg-black">
                    <div className="3xl:right-75 absolute 2xl:top-4 top-8 xl:right-28">
                        <ExpandedMediaGalleryActions />
                    </div>
                    <ExpandedMediaDisplay />
                </div>
            </motion.div>
        </>
    );
}
