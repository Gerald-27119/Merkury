import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getBasicSpotWeather } from "../../../../http/weather";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { BiWind } from "react-icons/bi";
import VerticalLine from "./components/VerticalLine";
import WeatherIcon from "./components/WeatherIcon";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { spotWeatherActions } from "../../../../redux/spot-weather";

export default function BasicSpotWeather() {
    const { latitude, longitude } = useSelectorTyped(
        (state) => state.spotWeather,
    );

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getBasicSpotWeather(latitude, longitude),
        queryKey: ["spot", "weather", latitude, longitude],
    });

    const dispatch = useDispatchTyped();

    const handleClickShowMore = () => {
        dispatch(spotWeatherActions.openDetailedWeatherModal());
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return (
            <div className="dark:bg-violetDarker bg-fifth text-violetDark dark:text-darkText rounded-2xl px-3 py-1 text-lg">
                <p>Failed to load weather for this spot!</p>
            </div>
        );
    }

    return (
        data && (
            <div className="dark:bg-violetDarker bg-fifth text-violetDark dark:text-darkText 3xl:right-1/4 absolute top-2 right-1/8 flex items-center space-x-2 rounded-3xl px-3 py-2 text-xl drop-shadow-md dark:drop-shadow-none">
                <WeatherIcon code={data.weatherCode} isDay={data.isDay} />
                <VerticalLine />
                {data?.temperature}
                <span>&deg;C</span>
                <VerticalLine />
                <div className="flex items-baseline">
                    {data.windSpeed}
                    <span className="text-sm">m/s</span>
                </div>
                <BiWind />
                <VerticalLine />
                <button
                    className="cursor-pointer"
                    onClick={handleClickShowMore}
                    type="button"
                >
                    Show more
                </button>
            </div>
        )
    );
}
