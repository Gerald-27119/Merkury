import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import {
    getCurrentTime,
    getWeatherAdjective,
} from "../../../../../utils/weather";
import WeatherIcon from "../../../../map/components/weather/components/WeatherIcon";

type WeatherOverviewProps = {
    temperature: number;
    weatherCode: number;
};

export default function WeatherOverview({
    temperature,
    weatherCode,
}: WeatherOverviewProps) {
    const { city, region } = useSelectorTyped((state) => state.spotWeather);
    return (
        <div className="text-darkText mt-2 flex flex-col rounded-lg bg-gradient-to-r from-gray-700 via-cyan-950 to-indigo-800 px-3 py-2.5">
            <div className="flex">
                <div>
                    <h2>{city}</h2>
                    <h3 className="text-grayText text-xs">{region}</h3>
                </div>
                <p className="ml-10 text-4xl">{getCurrentTime()}</p>
            </div>
            <div className="mt-3 flex text-xl">
                <span className="text-2xl">{temperature}&deg;C</span>
                <div className="ml-10 flex items-center">
                    <WeatherIcon code={weatherCode} textSize="text-4xl" />
                    {getWeatherAdjective(weatherCode)}
                </div>
            </div>
        </div>
    );
}
