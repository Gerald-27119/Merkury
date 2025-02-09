import { useQuery } from "@tanstack/react-query";
import { fetchWeather, getWeatherData } from "../../../http/weather.js";

export default function Weather({ spot }) {
  const { data, error, isLoading } = useQuery({
    queryFn: () =>
      fetchWeather(spot.weatherApiCallCoords[0], spot.weatherApiCallCoords[1]),
    queryKey: ["weather"],
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const weatherData = getWeatherData(data);

  return (
    <div>
      <div>
        <h1>Sunrise:</h1>
        <p>{weatherData.sunrise}</p>
      </div>
      <div>
        <h1>Sunset:</h1>
        <p>{weatherData.sunset}</p>
      </div>
      <div>
        <h1>Temperature:</h1>
        <p>{weatherData.temperature}</p>
      </div>
      <div>
        <h1>Weather code:</h1>
        <p>{weatherData.weatherCode}</p>
      </div>
      <div>
        <h1>Wind speed:</h1>
        {weatherData.winds.map((wind) => (
          <p key={wind.height}>
            {wind.height}m - {wind.speed}m/s
          </p>
        ))}
      </div>
    </div>
  );
}
