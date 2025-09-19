import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWindSpeeds } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import SelectHeightButton from "./SelectHeightButton";
import WindSpeedDisplay from "./WindSpeedDisplay";
import { useState } from "react";

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

    const [selectedHeight, setSelectedHeight] = useState(
        windSpeedsSelection[0].label,
    );

    const selected = windSpeedsSelection.find(
        (ws) => ws.label === selectedHeight,
    )!;
    const windSpeed = data?.hourly[selected.value][0] ?? 0;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <p>Failed to load wind speeds data</p>;
    }

    return (
        <div className="bg-whiteSmoke mt-4 flex items-center rounded-lg py-3 shadow-md">
            <WindSpeedDisplay value={windSpeed} />
            <div className="ml-1">
                <h3 className="mb-1.5">Height</h3>
                <ul className="grid grid-cols-2 gap-2">
                    {windSpeedsSelection.map((ws) => (
                        <li key={ws.label}>
                            <SelectHeightButton
                                name={ws.label}
                                onClick={() => setSelectedHeight(ws.label)}
                                selected={ws.label === selectedHeight}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
