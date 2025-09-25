import { motion } from "framer-motion";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { spotWeatherActions } from "../../../../redux/spot-weather";
import { HiX } from "react-icons/hi";
import WeatherOverview from "./components/WeatherOverview";
import { useQuery } from "@tanstack/react-query";
import { getDetailedSpotWeather } from "../../../../http/weather";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import WeatherDetails from "./components/WeatherDetails";
import WindSpeeds from "./components/WindSpeeds";
import WeatherTimelinePlot from "./components/WeatherTimelinePlot";

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

    const { latitude, longitude } = useSelectorTyped(
        (state) => state.spotWeather,
    );

    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ["spot-detailed-weather", latitude, longitude, spotId],
        queryFn: () => getDetailedSpotWeather(latitude, longitude),
    });

    return (
        <motion.div
            key={spotId}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="dark:bg-lightGrayishViolet absolute right-0 z-[2] flex h-full w-[29rem] flex-col overflow-y-auto px-2 pt-2 pb-16 text-lg xl:top-0 xl:p-2"
        >
            <div className="mt-2 flex">
                <HiX
                    className="cursor-pointer text-2xl"
                    onClick={handleCloseModal}
                />
                <h1 className="mx-auto text-2xl">Weather</h1>
            </div>
            {isLoading && <LoadingSpinner />}
            {isError && <p>Failed to load weather.</p>}
            {isSuccess && data && (
                <div className="3xl:space-y-4 3xl:mt-2 mt-1 flex flex-col space-y-2">
                    <WeatherOverview
                        temperature={data.temperature}
                        weatherCode={data.weatherCode}
                        isDay={data.isDay}
                    />
                    <WeatherDetails
                        rainChance={data.precipitationProbability}
                        dewPoint={data.dewPoint}
                        uvIndex={data.uvIndexMax}
                        humidity={data.relativeHumidity}
                    />
                    <WindSpeeds />
                    <WeatherTimelinePlot />
                </div>
            )}
        </motion.div>
    );
}
