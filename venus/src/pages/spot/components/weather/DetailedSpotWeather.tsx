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
            className="dark:bg-lightGrayishViolet absolute top-0 right-0 z-[2] flex h-full w-[29rem] flex-col p-2 text-lg"
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
            {isSuccess && (
                <div className="mt-2 flex flex-col space-y-4">
                    <WeatherOverview
                        temperature={data.current.temperature_2m}
                        weatherCode={data.current.weather_code}
                        sunrise={data.daily.sunset}
                        sunset={data.daily.sunrise}
                    />
                    <WeatherDetails
                        rainChance={data.current.precipitation_probability}
                        dewPoint={data.current.dew_point_2m}
                        uvIndex={data.daily.uv_index_max[0]}
                        humidity={data.current.relative_humidity_2m}
                    />
                    <WindSpeeds />
                    <WeatherTimelinePlot />
                </div>
            )}
        </motion.div>
    );
}
