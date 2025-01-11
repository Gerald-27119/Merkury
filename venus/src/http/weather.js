import { fetchWeatherApi } from "openmeteo";

const fetchWeatherData = async (latitude, longitude) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "is_day",
      "weather_code",
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
  };
  const url = "https://api.open-meteo.com/v1/forecast";

  try {
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();
    console.log(response.daily().variables(0));
    console.log(response.current().variables(0));
    const currentHour = new Date().getUTCHours();
    const flooredHour = Math.floor(currentHour);
    const closestHourlyIndex =
      flooredHour % hourly.variables(0).valuesArray().length;

    return {
      current: {
        temperature2m: current.variables(0).value().toFixed(1),
        relativeHumidity2m: current.variables(1).value(),
        isDay: current.variables(2).values(),
        type: current.variables(3).value(),
      },
      hourly: {
        winds: [
          {
            height: 100,
            speed: parseInt(
              hourly.variables(0).valuesArray()[closestHourlyIndex],
            ),
          },
          {
            height: 300,
            speed: parseInt(
              hourly.variables(1).valuesArray()[closestHourlyIndex],
            ),
          },
          {
            height: 500,
            speed: hourly
              .variables(2)
              .valuesArray()
              [closestHourlyIndex].toFixed(0),
          },
          {
            height: 800,
            speed: hourly
              .variables(3)
              .valuesArray()
              [closestHourlyIndex].toFixed(0),
          },
          {
            height: 1000,
            speed: hourly
              .variables(4)
              .valuesArray()
              [closestHourlyIndex].toFixed(0),
          },
        ],
      },
      daily: {
        sunrise: daily.variables(0).value(),
        sunset: daily.variables(1).value(),
      },
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export default fetchWeatherData;
