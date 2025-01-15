import {
  IoCloudy,
  IoPartlySunny,
  IoRainy,
  IoSnow,
  IoSunny,
  IoThunderstorm,
} from "react-icons/io5";

const weatherIcons = {
  0: { icon: IoSunny, className: "text-yellow-300" },
  1: { icon: IoPartlySunny, className: "text-gray-400" },
  2: { icon: IoPartlySunny, className: "text-gray-400" },
  3: { icon: IoCloudy, className: "text-gray-400" },
  45: { icon: IoCloudy, className: "text-gray-400" },
  48: { icon: IoCloudy, className: "text-gray-400" },
  51: { icon: IoRainy, className: "text-blue-500" },
  53: { icon: IoRainy, className: "text-blue-500" },
  55: { icon: IoRainy, className: "text-blue-500" },
  56: { icon: IoRainy, className: "text-blue-500" },
  57: { icon: IoRainy, className: "text-blue-500" },
  61: { icon: IoRainy, className: "text-blue-500" },
  63: { icon: IoRainy, className: "text-blue-500" },
  65: { icon: IoRainy, className: "text-blue-500" },
  66: { icon: IoRainy, className: "text-blue-500" },
  67: { icon: IoRainy, className: "text-blue-500" },
  80: { icon: IoRainy, className: "text-blue-500" },
  81: { icon: IoRainy, className: "text-blue-500" },
  82: { icon: IoRainy, className: "text-blue-500" },
  71: { icon: IoSnow, className: "text-white" },
  73: { icon: IoSnow, className: "text-white" },
  75: { icon: IoSnow, className: "text-white" },
  77: { icon: IoSnow, className: "text-white" },
  85: { icon: IoSnow, className: "text-white" },
  86: { icon: IoSnow, className: "text-white" },
  95: { icon: IoThunderstorm, className: "text-gray-700" },
  96: { icon: IoThunderstorm, className: "text-gray-700" },
  99: { icon: IoThunderstorm, className: "text-gray-700" },
};

const WeatherIcon = ({ generalWeather }) => {
  const weather = weatherIcons[generalWeather];
  if (!weather) return null;

  const IconComponent = weather.icon;
  return <IconComponent size={40} className={`${weather.className} ml-3`} />;
};

export default WeatherIcon;
