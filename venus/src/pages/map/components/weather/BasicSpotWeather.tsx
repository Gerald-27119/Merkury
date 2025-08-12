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
            <div className="dark:bg-violetDarker dark:text-darkText rounded-2xl px-3 py-1 text-lg">
                <p>Failed to load weather for this spot!</p>
            </div>
        );
    }

    return (
        <div className="dark:bg-violetDarker dark:text-darkText absolute top-3 right-1/8 flex items-center space-x-2 rounded-3xl px-3 py-1.5 text-xl">
            <WeatherIcon code={data.current.weather_code} />
            <VerticalLine />
            {data.current.temperature_2m}
            <span>&deg;C</span>
            <VerticalLine />
            <div className="flex items-baseline">
                {data.current.wind_speed_10m}
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
    );
}
