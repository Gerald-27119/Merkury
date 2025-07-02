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
    0: <WiDaySunny className="text-5xl text-yellow-500" />,
    1: <WiCloud className="text-5xl text-gray-400" />,
    2: <WiCloud className="text-5xl text-gray-500" />,
    3: <WiCloud className="text-5xl text-gray-700" />,
    45: <WiFog className="text-5xl text-gray-600" />,
    48: <WiFog className="text-5xl text-gray-700" />,
    51: <WiRaindrops className="text-5xl text-blue-400" />,
    53: <WiRaindrops className="text-5xl text-blue-500" />,
    55: <WiRaindrops className="text-5xl text-blue-600" />,
    56: <WiRainMix className="text-5xl text-blue-400" />,
    57: <WiRainMix className="text-5xl text-blue-600" />,
    61: <WiRaindrops className="text-5xl text-blue-400" />,
    63: <WiRaindrops className="text-5xl text-blue-500" />,
    65: <WiRaindrops className="text-5xl text-blue-700" />,
    66: <WiRainMix className="text-5xl text-blue-500" />,
    67: <WiRainMix className="text-5xl text-blue-700" />,
    71: <WiSnow className="text-5xl text-blue-400" />,
    73: <WiSnow className="text-5xl text-blue-500" />,
    75: <WiSnow className="text-5xl text-blue-700" />,
    77: <WiSnow className="text-5xl text-gray-400" />,
    80: <WiRaindrops className="text-5xl text-blue-400" />,
    81: <WiRaindrops className="text-5xl text-blue-500" />,
    82: <WiRaindrops className="text-5xl text-blue-700" />,
    85: <WiSnow className="text-5xl text-blue-400" />,
    86: <WiSnow className="text-5xl text-blue-700" />,
    95: <WiThunderstorm className="text-5xl text-yellow-500" />,
    96: <WiThunderstorm className="text-5xl text-yellow-600" />,
    99: <WiThunderstorm className="text-5xl text-yellow-800" />,
};

export default function WeatherIcon({ code }) {
    return (
        weatherIcons[code] || <FaQuestion className="text-5xl text-gray-400" />
    );
}
