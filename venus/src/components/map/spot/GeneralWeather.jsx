import {
  IoSunny,
  IoCloudy,
  IoPartlySunny,
  IoRainy,
  IoSnow,
  IoThunderstorm,
} from "react-icons/io5";

export default function GeneralWeather({ generalWeather }) {
  return (
    <>
      {generalWeather === 0 && (
        <IoSunny size={40} className="text-yellow-300 ml-3" />
      )}
      {(generalWeather === 1 || generalWeather === 2) && (
        <IoPartlySunny size={40} className="text-gray-400 ml-3" />
      )}
      {(generalWeather === 3 ||
        generalWeather === 45 ||
        generalWeather === 48) && (
        <IoCloudy size={40} className="text-gray-400 ml-3" />
      )}
      {(generalWeather === 51 ||
        generalWeather === 53 ||
        generalWeather === 55 ||
        generalWeather === 56 ||
        generalWeather === 57 ||
        generalWeather === 61 ||
        generalWeather === 63 ||
        generalWeather === 65 ||
        generalWeather === 66 ||
        generalWeather === 67 ||
        generalWeather === 80 ||
        generalWeather === 81 ||
        generalWeather === 82) && (
        <IoRainy size={40} className="text-blue-500 ml-3" />
      )}
      {(generalWeather === 71 ||
        generalWeather === 73 ||
        generalWeather === 75 ||
        generalWeather === 77 ||
        generalWeather === 85 ||
        generalWeather === 86) && (
        <IoSnow size={40} className="text-white ml-3" />
      )}
      {(generalWeather === 95 ||
        generalWeather === 96 ||
        generalWeather === 99) && (
        <IoThunderstorm size={40} className="text-gray-700 ml-3" />
      )}
    </>
  );
}
