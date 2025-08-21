import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "../../../../http/weather";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { TbTemperatureCelsius } from "react-icons/tb";
import { getWeatherData } from "../../../../utils/weather.js";
import { WiThermometer } from "react-icons/wi";
import WeatherIcon from "../../../map/components/weather/components/WeatherIcon";
import WindSpeed from "./wind-speed/WindSpeed";
import WeatherTile from "./WeatherTile";
import WeatherRow from "./WeatherRow";
import { useEffect } from "react";
import { notificationAction } from "../../../../redux/notification";
import { useDispatch } from "react-redux";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";

export default function Weather({ spot }) {
    const { data, error, isLoading } = useQuery({
        queryFn: () =>
            fetchWeather(
                spot.weatherApiCallCoords.x,
                spot.weatherApiCallCoords.y,
            ),
        queryKey: ["weather", spot.id],
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (error?.response?.data) {
            dispatch(
                notificationAction.setError({
                    message: error.response.data,
                }),
            );
        }
    }, [dispatch, error]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const weatherData = getWeatherData(data);

    return (
        <div className="flex flex-col space-y-2 rounded-md bg-white p-2 shadow-md">
            <h1 className="text-center text-xl font-semibold">Weather</h1>
            <div className="flex flex-col space-y-2">
                <WeatherRow>
                    <WeatherTile>
                        <FiSunrise className="mr-2" />
                        <p>{weatherData.sunrise}</p>
                    </WeatherTile>
                    <WeatherTile>
                        <FiSunset className="mr-2" />
                        <p>{weatherData.sunset}</p>
                    </WeatherTile>
                </WeatherRow>
                <WeatherRow>
                    <WeatherTile>
                        <WiThermometer className="mt-1 text-4xl" />
                        <p className="flex items-center">
                            {weatherData.temperature} <TbTemperatureCelsius />
                        </p>
                    </WeatherTile>
                    <WeatherTile>
                        <WeatherIcon code={weatherData.weatherCode} />
                    </WeatherTile>
                </WeatherRow>
                <WindSpeed winds={weatherData.winds} />
            </div>
        </div>
    );
}
