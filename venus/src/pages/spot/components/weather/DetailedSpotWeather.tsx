import { motion } from "framer-motion";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { spotWeatherActions } from "../../../../redux/spot-weather";
import { HiX } from "react-icons/hi";

const slideVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
};

export default function DetailedSpotWeather() {
    const spotId = useSelectorTyped((state) => state.spotDetails.spotId);

    const dispatch = useDispatchTyped();

    const handleCloseModal = () => {
        dispatch(spotWeatherActions.closeDetailedWeatherModal());
    };

    return (
        <motion.div
            key={spotId}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="dark:bg-violetDarker dark:text-darkText absolute top-0 right-0 z-[2] flex h-full w-[20rem] p-2 text-lg"
        >
            <HiX className="cursor-pointer" onClick={handleCloseModal} />
        </motion.div>
    );
}
