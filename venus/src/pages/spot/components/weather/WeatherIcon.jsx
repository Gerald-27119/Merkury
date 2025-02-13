import {
  WiCloud,
  WiDaySunny,
  WiFog,
  WiRaindrops,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { FaQuestion } from "react-icons/fa";

const weatherIcons = {
  0: <WiDaySunny className="text-yellow-500 text-5xl" />,
  1: <WiCloud className="text-gray-400 text-5xl" />,
  2: <WiCloud className="text-gray-500 text-5xl" />,
  3: <WiCloud className="text-gray-700 text-5xl" />,
  45: <WiFog className="text-gray-600 text-5xl" />,
  48: <WiFog className="text-gray-700 text-5xl" />,
  51: <WiRaindrops className="text-blue-400 text-5xl" />,
  53: <WiRaindrops className="text-blue-500 text-5xl" />,
  55: <WiRaindrops className="text-blue-600 text-5xl" />,
  56: <WiRainMix className="text-blue-400 text-5xl" />,
  57: <WiRainMix className="text-blue-600 text-5xl" />,
  61: <WiRaindrops className="text-blue-400 text-5xl" />,
  63: <WiRaindrops className="text-blue-500 text-5xl" />,
  65: <WiRaindrops className="text-blue-700 text-5xl" />,
  66: <WiRainMix className="text-blue-500 text-5xl" />,
  67: <WiRainMix className="text-blue-700 text-5xl" />,
  71: <WiSnow className="text-blue-400 text-5xl" />,
  73: <WiSnow className="text-blue-500 text-5xl" />,
  75: <WiSnow className="text-blue-700 text-5xl" />,
  77: <WiSnow className="text-gray-400 text-5xl" />,
  80: <WiRaindrops className="text-blue-400 text-5xl" />,
  81: <WiRaindrops className="text-blue-500 text-5xl" />,
  82: <WiRaindrops className="text-blue-700 text-5xl" />,
  85: <WiSnow className="text-blue-400 text-5xl" />,
  86: <WiSnow className="text-blue-700 text-5xl" />,
  95: <WiThunderstorm className="text-yellow-500 text-5xl" />,
  96: <WiThunderstorm className="text-yellow-600 text-5xl" />,
  99: <WiThunderstorm className="text-yellow-800 text-5xl" />,
};

export default function WeatherIcon({ code }) {
  return (
    weatherIcons[code] || <FaQuestion className="text-gray-400 text-5xl" />
  );
}
