import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import {
    formatISOToAmPm,
    getWeatherAdjective,
} from "../../../../../utils/weather";
import WeatherIcon from "../../../../map/components/weather/components/WeatherIcon";
import { useQuery } from "@tanstack/react-query";
import { getSpotTimeZone } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { useEffect, useState } from "react";

type WeatherOverviewProps = {
    temperature: number;
    weatherCode: number;
    isDay: boolean;
};

export default function WeatherOverview({
    temperature,
    weatherCode,
    isDay,
}: WeatherOverviewProps) {
    const [currentTime, setCurrentTime] = useState<string>(
        formatISOToAmPm(new Date().toISOString(), "Europe/Warsaw"),
    );

    const { city, region } = useSelectorTyped((state) => state.spotWeather);
    const { spotId } = useSelectorTyped((state) => state.spotDetails);

    const { data, isSuccess, isError, isLoading } = useQuery({
        queryKey: ["spot-time-zone", spotId],
        queryFn: () => getSpotTimeZone(spotId!),
        enabled: !!spotId,
        retry: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setCurrentTime(
                formatISOToAmPm(new Date().toISOString(), data.timeZone),
            );

            const intervalId = setInterval(() => {
                setCurrentTime(
                    formatISOToAmPm(new Date().toISOString(), data.timeZone),
                );
            }, 60 * 1000);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [data, isSuccess]);

    return (
        <div className="text-darkText 3xl:mt-2.5 mt-1.5 flex flex-col rounded-lg bg-gradient-to-r from-slate-500 via-blue-950 to-blue-900 px-3 py-2.5">
            <div className="ml-12 flex">
                <div>
                    <h2>{city}</h2>
                    <h3 className="text-grayText text-xs">{region}</h3>
                </div>
                {isLoading && <LoadingSpinner />}
                {isError && (
                    <p className="ml-24 text-4xl">
                        Failed to get spot current time.
                    </p>
                )}
                {isSuccess && <p className="ml-24 text-4xl">{currentTime}</p>}
            </div>
            <div className="mt-3 ml-12 flex text-xl">
                <span className="text-2xl">{temperature}&deg;C</span>
                <div className="ml-22 flex items-center">
                    <WeatherIcon
                        isDay={isDay}
                        code={weatherCode}
                        textSize="text-4xl"
                    />
                    {getWeatherAdjective(weatherCode, isDay)}
                </div>
            </div>
        </div>
    );
}
