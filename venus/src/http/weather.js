import axios from "axios";

const fetchWeatherData = async (latitude, longitude) => {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&current=temperature_2m,relative_humidity_2m,is_day,weather_code&hourly=wind_speed_1000hPa,wind_speed_975hPa,wind_speed_950hPa,wind_speed_925hPa,wind_speed_900hPa&daily=sunrise,sunset&wind_speed_unit=ms&forecast_days=1`,
  );

  const responseData = response.data;

  const current = responseData.current;
  const hourly = responseData.hourly;
  const daily = responseData.daily;
  const currentHour = new Date().getUTCHours();
  const flooredHour = Math.floor(currentHour);
  const closestHourlyIndex = flooredHour % 24;
  const sunrise = String(daily["sunrise"][0]).split("T")[1];
  const sunset = String(daily["sunset"][0]).split("T")[1];

  return {
    current: {
      temperature2m: current["temperature_2m"].toFixed(1),
      relativeHumidity2m: current["relative_humidity_2m"],
      isDay: current["is_day"],
      type: current["weather_code"],
    },
    hourly: {
      winds: [
        {
          height: 100,
          speed: parseInt(hourly["wind_speed_1000hPa"][closestHourlyIndex]),
        },
        {
          height: 300,
          speed: parseInt(hourly["wind_speed_975hPa"][closestHourlyIndex]),
        },
        {
          height: 500,
          speed: parseInt(hourly["wind_speed_950hPa"][closestHourlyIndex]),
        },
        {
          height: 800,
          speed: parseInt(hourly["wind_speed_925hPa"][closestHourlyIndex]),
        },
        {
          height: 1000,
          speed: parseInt(hourly["wind_speed_900hPa"][closestHourlyIndex]),
        },
      ],
    },
    daily: {
      sunrise: sunrise,
      sunset: sunset,
    },
  };
};

export default fetchWeatherData;
