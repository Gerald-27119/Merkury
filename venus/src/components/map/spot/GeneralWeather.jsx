import WeatherIcons from "./WeatherIcon.jsx";

export default function GeneralWeather({ generalWeather }) {
  return (
    <>
      <WeatherIcons generalWeather={generalWeather} />
    </>
  );
}
