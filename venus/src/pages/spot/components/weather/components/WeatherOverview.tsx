import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import {
    getCurrentTime,
    getWeatherAdjective,
} from "../../../../../utils/weather";
import WeatherIcon from "../../../../map/components/weather/components/WeatherIcon";

type WeatherOverviewProps = {
    temperature: number;
    weatherCode: number;
    sunrise: string;
    sunset: string;
};

export default function WeatherOverview({
    temperature,
    weatherCode,
    sunset,
    sunrise,
}: WeatherOverviewProps) {
    const { city, region } = useSelectorTyped((state) => state.spotWeather);
    return (
        <div className="text-darkText mt-2.5 flex flex-col rounded-lg bg-gradient-to-r from-slate-500 via-blue-950 to-blue-900 px-3 py-2.5">
            <div className="ml-12 flex">
                <div>
                    <h2>{city}</h2>
                    <h3 className="text-grayText text-xs">{region}</h3>
                </div>
                <p className="ml-24 text-4xl">{getCurrentTime()}</p>
            </div>
            <div className="mt-3 ml-12 flex text-xl">
                <span className="text-2xl">{temperature}&deg;C</span>
                <div className="ml-22 flex items-center">
                    <WeatherIcon
                        sunriseIso={sunrise}
                        sunsetIso={sunset}
                        timeIso={new Date().toISOString()}
                        code={weatherCode}
                        textSize="text-4xl"
                    />
                    {getWeatherAdjective(
                        weatherCode,
                        sunrise,
                        sunset,
                        new Date().toISOString(),
                    )}
                </div>
            </div>
        </div>
    );
}
