import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWindSpeeds } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import SelectHeightButton from "./SelectHeightButton";
import WindSpeedDisplay from "./WindSpeedDisplay";

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

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <p>Failed to load wind speeds data</p>;
    }

    return (
        <div className="bg-whiteSmoke mt-4 flex items-center rounded-lg shadow-md">
            <WindSpeedDisplay value={100} />
            <ul>
                {windSpeedsSelection.map((ws) => (
                    <li key={ws.label}>
                        <SelectHeightButton name={ws.label} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
