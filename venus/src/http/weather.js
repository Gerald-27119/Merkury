import axios from "axios";

export async function fetchWeather(latitude, longitude) {
  return (
    await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current: ["temperature_2m", "weather_code"],
        hourly: [
          "wind_speed_1000hPa",
          "wind_speed_975hPa",
          "wind_speed_950hPa",
          "wind_speed_925hPa",
          "wind_speed_900hPa",
          "wind_speed_10m",
          "wind_speed_80m",
        ],
        daily: ["sunrise", "sunset"],
        wind_speed_unit: "ms",
      },
    })
  ).data;
}

export function getWeatherData(data) {
  const date = new Date();
  const currentDay = date.getUTCDay();
  const currentHour = date.getHours();
  const hourInWeek = currentHour * (currentDay + 1);

  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  return {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    winds: [
      { height: 10, speed: hourly.wind_speed_10m[hourInWeek] },
      { height: 80, speed: hourly.wind_speed_80m[hourInWeek] },
      { height: 110, speed: hourly.wind_speed_1000hPa[hourInWeek] },
      { height: 320, speed: hourly.wind_speed_975hPa[hourInWeek] },
      { height: 500, speed: hourly.wind_speed_950hPa[hourInWeek] },
      { height: 800, speed: hourly.wind_speed_925hPa[hourInWeek] },
      { height: 1000, speed: hourly.wind_speed_900hPa[hourInWeek] },
    ],
    sunrise: formatTime(daily.sunrise[currentDay]),
    sunset: formatTime(daily.sunset[currentDay]),
  };
}

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
