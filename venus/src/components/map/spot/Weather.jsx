import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "../../../http/weather.js";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { TbTemperatureCelsius } from "react-icons/tb";
import { getWeatherData } from "../../../utils/weather.jsx";
import { WiThermometer } from "react-icons/wi";
import WeatherIcon from "./WeatherIcon.jsx";
import WindSpeed from "./WindSpeed.jsx";
import WeatherTile from "./WeatherTile.jsx";
import WeatherRow from "./WeatherRow.jsx";

export default function Weather({ spot }) {
  const { data, error, isLoading } = useQuery({
    queryFn: () =>
      fetchWeather(spot.weatherApiCallCoords[0], spot.weatherApiCallCoords[1]),
    queryKey: ["weather", spot.id],
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const weatherData = getWeatherData(data);

  return (
    <div className="flex flex-col space-y-2 p-2 rounded-md shadow-md bg-white">
      <h1 className="font-semibold text-xl text-center">Weather</h1>
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
            <WiThermometer className="text-4xl mt-1" />
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
