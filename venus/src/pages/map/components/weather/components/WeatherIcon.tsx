import {
    WiCloud,
    WiDayCloudy,
    WiDaySunny,
    WiFog,
    WiRaindrops,
    WiRainMix,
    WiSnow,
    WiThunderstorm,
} from "react-icons/wi";
import { FaQuestion } from "react-icons/fa";
import { IconType } from "react-icons";
import { CiCloudMoon } from "react-icons/ci";
import { PiMoonLight } from "react-icons/pi";

const weatherIcons: Record<number, IconType[]> = {
    0: [PiMoonLight, WiDaySunny],
    1: [CiCloudMoon, WiDayCloudy],
    2: [CiCloudMoon, WiDayCloudy],
    3: [WiCloud, WiCloud],
    45: [WiFog, WiFog],
    48: [WiFog, WiFog],
    51: [WiRaindrops, WiRaindrops],
    53: [WiRaindrops, WiRaindrops],
    55: [WiRaindrops, WiRaindrops],
    56: [WiRainMix, WiRainMix],
    57: [WiRainMix, WiRainMix],
    61: [WiRaindrops, WiRaindrops],
    63: [WiRaindrops, WiRaindrops],
    65: [WiRaindrops, WiRaindrops],
    66: [WiRainMix, WiRainMix],
    67: [WiRainMix, WiRainMix],
    71: [WiSnow, WiSnow],
    73: [WiSnow, WiSnow],
    75: [WiSnow, WiSnow],
    77: [WiSnow, WiSnow],
    80: [WiRaindrops, WiRaindrops],
    81: [WiRaindrops, WiRaindrops],
    82: [WiRaindrops, WiRaindrops],
    85: [WiSnow, WiSnow],
    86: [WiSnow, WiSnow],
    95: [WiThunderstorm, WiThunderstorm],
    96: [WiThunderstorm, WiThunderstorm],
    99: [WiThunderstorm, WiThunderstorm],
};

export default function WeatherIcon({
    code,
    textSize,
    isDay,
}: {
    code: number;
    textSize?: string;
    isDay: boolean;
}) {
    const Icon = weatherIcons[code][isDay ? 1 : 0] || FaQuestion;
    return <Icon className={`${textSize ?? "text-3xl"}`} />;
}
