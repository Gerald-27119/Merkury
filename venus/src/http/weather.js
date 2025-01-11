import { fetchWeatherApi } from "openmeteo";

const fetchWeatherData = async (latitude, longitude) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "is_day",
      "precipitation",
      "rain",
      "showers",
      "cloud_cover",
    ],
    hourly: [
      "wind_speed_1000hPa",
      "wind_speed_975hPa",
      "wind_speed_950hPa",
      "wind_speed_925hPa",
      "wind_speed_900hPa",
    ],
    daily: ["sunrise", "sunset"],
    wind_speed_unit: "ms",
    timezone: "Europe/Berlin",
  };
  const url = "https://api.open-meteo.com/v1/forecast";

  try {
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    const currentHour = new Date().getUTCHours();
    const flooredHour = Math.floor(currentHour);
    const closestHourlyIndex =
      flooredHour % hourly.variables(0).valuesArray().length;

    return {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0).value(),
        relativeHumidity2m: current.variables(1).value(),
        isDay: current.variables(2).value(),
        precipitation: current.variables(3).value(),
        rain: current.variables(4).value(),
        showers: current.variables(5).value(),
        cloudCover: current.variables(6).value(),
      },
      hourly: {
        time: new Date(
          (Number(hourly.time()) +
            closestHourlyIndex * hourly.interval() +
            utcOffsetSeconds) *
            1000,
        ),
        windSpeeds: [
          hourly.variables(0).valuesArray()[closestHourlyIndex],
          hourly.variables(1).valuesArray()[closestHourlyIndex],
          hourly.variables(2).valuesArray()[closestHourlyIndex],
          hourly.variables(3).valuesArray()[closestHourlyIndex],
          hourly.variables(4).valuesArray()[closestHourlyIndex],
        ],
      },
      daily: {
        time: Array.from(
          {
            length:
              (Number(daily.timeEnd()) - Number(daily.time())) /
              daily.interval(),
          },
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000,
            ),
        ),
        sunrise: daily.variables(0).valuesArray(),
        sunset: daily.variables(1).valuesArray(),
      },
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export default fetchWeatherData;
