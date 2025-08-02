import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import MostPopularSpot from "./MostPopularSpot";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TopRatedSpot } from "../../../model/interface/spot/topRatedSpot";

interface CarouselProps {
    spots: TopRatedSpot[];
    spotsPerPage?: number;
}

export default function Carousel({ spots, spotsPerPage = 6 }: CarouselProps) {
    const totalPages = Math.ceil(spots.length / spotsPerPage);
    const [[page, direction], setPage] = useState([0, 0]);

    const getWrappedPage = (index: number) => {
        if (index < 0) return totalPages - 1;
        if (index >= totalPages) return 0;
        return index;
    };

    const paginate = (newDirection: number) => {
        setPage(([currentPage]) => {
            const nextPage = getWrappedPage(currentPage + newDirection);
            return [nextPage, newDirection];
        });
    };

    const sliderVariants = {
        incoming: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            scale: 1.05,
            opacity: 1,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        }),
        active: {
            x: 0,
            scale: 1,
            opacity: 1,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? "-100%" : "100%",
            scale: 0.95,
            opacity: 0.5,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
        }),
    };

    const currentSpots = spots.slice(
        page * spotsPerPage,
        page * spotsPerPage + spotsPerPage,
    );

    return (
        <div className="relative flex w-full items-center justify-center">
            <button
                onClick={() => paginate(-1)}
                className="hover:text-darkBorder z-10 cursor-pointer transition-all duration-300"
            >
                <RiArrowLeftWideFill className="text-5xl sm:text-6xl" />
            </button>

            <div className="relative h-[440px] w-full max-w-[1200px] overflow-hidden">
                <AnimatePresence custom={direction} initial={false} mode="sync">
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={sliderVariants}
                        initial="incoming"
                        animate="active"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 330, damping: 80 },
                            opacity: { duration: 0.3 },
                            scale: {
                                type: "spring",
                                stiffness: 300,
                                damping: 40,
                            },
                        }}
                        className="grid w-full grid-cols-1 grid-rows-1 justify-items-center gap-4 lg:grid-cols-2 lg:grid-rows-2 2xl:grid-cols-3 2xl:grid-rows-2"
                    >
                        {currentSpots.map((spot) => (
                            <MostPopularSpot
                                spot={spot}
                                key={`${spot.id}-${page}`}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <button
                onClick={() => paginate(1)}
                className="hover:text-darkBorder z-10 cursor-pointer transition-all duration-300"
            >
                <RiArrowRightWideFill className="text-5xl sm:text-6xl" />
            </button>
        </div>
    );
}
