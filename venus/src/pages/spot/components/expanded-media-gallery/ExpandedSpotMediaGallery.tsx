import ExpandedGallerySidebar from "./components/expanded-gallery-sidebar/ExpandedGallerySidebar";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { motion } from "framer-motion";

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
                className="dark:text-darkText absolute top-10 left-0 z-[3] flex h-full w-full overflow-y-auto text-lg xl:top-0 xl:left-17 xl:text-xl"
            >
                <ExpandedGallerySidebar />
                <div className="z-[3] h-full w-full bg-black"></div>
            </motion.div>
        </>
    );
}
