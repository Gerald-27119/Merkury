import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWindSpeeds } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import SelectHeightButton from "./SelectHeightButton";
import WindSpeedDisplay from "./WindSpeedDisplay";
import { useState } from "react";
import SpotWeatherWIndSpeedsDto from "../../../../../model/interface/spot/weather/spotWeatherWIndSpeedsDto";

type windSpeedsSelectionType = {
    label: string;
    value: number;
};

export default function WindSpeeds() {
    const { latitude, longitude } = useSelectorTyped(
        (state) => state.spotWeather,
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: ["spot-weather", "wind-speeds", latitude, longitude],
        queryFn: () => getWindSpeeds(latitude, longitude),
    });

    const windSpeedsSelection: windSpeedsSelectionType[] = [
        { label: "100m", value: data?.windSpeeds100m ?? 0 },
        { label: "200m", value: data?.windSpeeds200m ?? 0 },
        { label: "300m", value: data?.windSpeeds300m ?? 0 },
        { label: "500m", value: data?.windSpeeds500m ?? 0 },
        { label: "750m", value: data?.windSpeeds750m ?? 0 },
        { label: ">1000m", value: data?.windSpeeds1000m ?? 0 },
    ];

    const [selectedHeight, setSelectedHeight] = useState(
        windSpeedsSelection[0].label,
    );

    const selected = windSpeedsSelection.find(
        (ws) => ws.label === selectedHeight,
    )!;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <p>Failed to load wind speeds data</p>;
    }

    return (
        <div className="bg-whiteSmoke 3xl:mt-4 mt-2 flex items-center rounded-lg py-3 shadow-md">
            <WindSpeedDisplay value={selected.value} />
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
