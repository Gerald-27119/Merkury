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
        <div className="3xl:mt-3 mt-1">
            <h2 className="mb-2 text-2xl">Today overview</h2>
            <div className="mx-auto grid grid-cols-2 grid-rows-2 gap-1.5">
                <WeatherTile className="col-start-1 row-start-1">
                    <div className="flex w-full flex-col">
                        <div className="flex items-center text-xs">
                            <WiRain className="3xl:text-3xl text-2xl" />
                            <h6>Rain Chance</h6>
                        </div>
                        <span className="3xl:text-4xl mx-auto mt-1.5 text-3xl">
                            {rainChance}%
                        </span>
                    </div>
                </WeatherTile>
                <WeatherTile className="col-start-2 row-start-1">
                    <div className="mt-1 flex w-full flex-col">
                        <div className="flex items-center text-sm">
                            <FaThermometerQuarter className="3xl:text-xl text-lg" />
                            <h6>Dew Point</h6>
                        </div>
                        <span className="3xl:text-4xl mx-auto mt-2.5 text-3xl">
                            {dewPoint}&deg;C
                        </span>
                    </div>
                </WeatherTile>
                <WeatherTile className="col-start-1 row-start-2">
                    <div className="mt-1 flex w-full flex-col">
                        <h6 className="text-sm">UV Index</h6>
                        <span className="3xl:text-4xl mx-auto mt-2 text-3xl">
                            {getUvIndexTextLevel(uvIndex)}
                        </span>
                    </div>
                </WeatherTile>
                <WeatherTile className="col-start-2 row-start-2">
                    <div className="flex w-full flex-col">
                        <div className="flex items-center text-sm">
                            <WiHumidity className="text-2xl" />
                            <h6>Humidity</h6>
                        </div>
                        <span className="3xl:text-4xl mx-auto mt-2 text-3xl">
                            {humidity}%
                        </span>
                    </div>
                </WeatherTile>
            </div>
        </div>
    );
}
