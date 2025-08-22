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
import { IconType } from "react-icons";

const weatherIcons: Record<number, IconType> = {
    0: WiDaySunny,
    1: WiCloud,
    2: WiCloud,
    3: WiCloud,
    45: WiFog,
    48: WiFog,
    51: WiRaindrops,
    53: WiRaindrops,
    55: WiRaindrops,
    56: WiRainMix,
    57: WiRainMix,
    61: WiRaindrops,
    63: WiRaindrops,
    65: WiRaindrops,
    66: WiRainMix,
    67: WiRainMix,
    71: WiSnow,
    73: WiSnow,
    75: WiSnow,
    77: WiSnow,
    80: WiRaindrops,
    81: WiRaindrops,
    82: WiRaindrops,
    85: WiSnow,
    86: WiSnow,
    95: WiThunderstorm,
    96: WiThunderstorm,
    99: WiThunderstorm,
};

export default function WeatherIcon({
    code,
    textSize,
}: {
    code: number;
    textSize?: string;
}) {
    const Icon = weatherIcons[code] || FaQuestion;
    return <Icon className={`${textSize ?? "text-3xl"}`} />;
}
