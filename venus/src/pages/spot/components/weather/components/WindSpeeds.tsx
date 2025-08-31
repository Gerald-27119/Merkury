import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWindSpeeds } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import SelectHeightButton from "./SelectHeightButton";
import WindSpeedDisplay from "./WindSpeedDisplay";
import { useState } from "react";
import { getTimeIndex } from "../../../../../utils/weather";

type windSpeedsSelectionType = {
    label: string;
    value: string;
};

const windSpeedsSelection: windSpeedsSelectionType[] = [
    { label: "100m", value: "wind_speed_1000hPa" },
    { label: "200m", value: "wind_speed_180m" },
    { label: "300m", value: "wind_speed_975hPa" },
    { label: "500m", value: "wind_speed_950hPa" },
    { label: "750m", value: "wind_speed_925hPa" },
    { label: ">1000m", value: "wind_speed_900hPa" },
];

export default function WindSpeeds() {
    const { latitude, longitude } = useSelectorTyped(
        (state) => state.spotWeather,
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: ["spot-weather", "wind-speeds", latitude, longitude],
        queryFn: () => getWindSpeeds(latitude, longitude),
    });

    const [selectedWind, setSelectedWind] = useState({
        height: windSpeedsSelection[0].label,
        windSpeed:
            data?.hourly[windSpeedsSelection[0].label][
                getTimeIndex(data?.hourly.time)
            ] ?? 0,
    });

    const handleSelectHeight = (height: string): void => {
        const selected = windSpeedsSelection.find((ws) => ws.label === height);

        setSelectedWind((prevState) => ({
            ...prevState,
            windSpeed:
                data?.hourly[selected!.value][getTimeIndex(data.hourly.time)],
        }));
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <p>Failed to load wind speeds data</p>;
    }

    return (
        <div className="bg-whiteSmoke mt-4 flex items-center rounded-lg py-3 shadow-md">
            <WindSpeedDisplay value={selectedWind.windSpeed} />
            <div className="ml-1">
                <h3 className="mb-1.5">Height</h3>
                <ul className="grid grid-cols-2 gap-2">
                    {windSpeedsSelection.map((ws) => (
                        <li key={ws.label}>
                            <SelectHeightButton
                                name={ws.label}
                                onClick={() => handleSelectHeight(ws.label)}
                                selected={ws.label === selectedWind.height}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
