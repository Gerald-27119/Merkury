import WeatherTile from "./WeatherTile";
import { WiRain } from "react-icons/wi";
import { FaThermometerQuarter } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { getUvIndexTextLevel } from "../../../../../utils/weather";

type WeatherDetailsProps = {
    rainChance: number;
    dewPoint: number;
    uvIndex: number;
    humidity: number;
};

export default function WeatherDetails({
    rainChance,
    dewPoint,
    uvIndex,
    humidity,
}: WeatherDetailsProps) {
    return (
        <div className="mt-3">
            <h2>Today overview</h2>
            <div className="mx-auto grid grid-cols-2 grid-rows-2 gap-1.5">
                <WeatherTile className="col-start-1 row-start-1">
                    <div className="flex w-full flex-col">
                        <div className="flex items-center text-xs">
                            <WiRain className="text-lg" />
                            <h6>Rain Chance</h6>
                        </div>
                        <span className="mx-auto">{rainChance}%</span>
                    </div>
                </WeatherTile>
                <WeatherTile className="col-start-2 row-start-1">
                    <div className="realtive flex w-full flex-col">
                        <div className="flex items-center text-xs">
                            <FaThermometerQuarter className="text-sm" />
                            <h6>Dew Point</h6>
                        </div>
                        <span className="mx-auto">{dewPoint}&deg;C</span>
                    </div>
                </WeatherTile>
                <WeatherTile className="col-start-1 row-start-2">
                    <div className="flex w-full flex-col">
                        <h6 className="text-xs">UV Index</h6>
                        <span className="mx-auto">
                            {getUvIndexTextLevel(uvIndex)}
                        </span>
                    </div>
                </WeatherTile>
                <WeatherTile className="col-start-2 row-start-2">
                    <div className="realtive flex w-full flex-col">
                        <div className="flex items-center text-xs">
                            <WiHumidity className="text-lg" />
                            <h6>Humidity</h6>
                        </div>
                        <span className="mx-auto">{humidity}%</span>
                    </div>
                </WeatherTile>
            </div>
        </div>
    );
}
