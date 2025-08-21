import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { getCurrentTime } from "../../../../../utils/weather";

export default function WeatherOverview() {
    const { city, region } = useSelectorTyped((state) => state.spotWeather);
    return (
        <div className="text-darkText flex justify-between rounded-lg bg-gradient-to-r from-gray-700 via-cyan-950 to-indigo-800 px-3 py-2.5">
            <div>
                <h2>{city}</h2>
                <h3 className="text-grayText text-xs">{region}</h3>
            </div>
            <p className="text-4xl">{getCurrentTime()}</p>
        </div>
    );
}
