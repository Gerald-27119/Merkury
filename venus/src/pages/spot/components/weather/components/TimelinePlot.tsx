import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWeatherDataForTimelinePlot } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { parseWeatherData } from "../../../../../utils/weather";
import {
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
    VictoryZoomContainer,
} from "victory";
import { useEffect, useState } from "react";
import SpotWeatherTimelinePlotData from "../../../../../model/interface/spot/weather/spotWeatherTimelinePlotData";

export default function TimelinePlot() {
    const { latitude, longitude } = useSelectorTyped(
        (state) => state.spotWeather,
    );

    const [plotData, setPlotData] = useState<SpotWeatherTimelinePlotData[]>();

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["spot-weather", "timeline-plot", latitude, longitude],
        queryFn: () => getWeatherDataForTimelinePlot(latitude, longitude),
    });

    useEffect(() => {
        if (isSuccess) {
            setPlotData(parseWeatherData(data.hourly));
        }
    }, [data, isSuccess]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <p>Failed to load data for timeline plot.</p>;
    }

    return (
        isSuccess &&
        plotData && (
            <div className="bg-mediumDarkBlue cursor-grab">
                <VictoryChart
                    theme={VictoryTheme.clean}
                    padding={{ top: 80, bottom: 80, left: 50, right: 50 }}
                    containerComponent={
                        <VictoryZoomContainer
                            zoomDomain={{
                                x: [0, 5],
                                y: [
                                    Math.min(
                                        ...plotData?.map((d) => d.temperature),
                                    ),
                                    Math.max(
                                        ...plotData?.map((d) => d.temperature),
                                    ),
                                ],
                            }}
                            responsive={false}
                            allowZoom={false}
                            allowPan={true}
                        />
                    }
                >
                    <VictoryAxis
                        orientation="top"
                        tickValues={plotData?.map((d) => d.time)}
                        tickFormat={(t) => t}
                        style={{
                            tickLabels: { fontSize: 12 },
                            axis: { strokeWidth: 0 },
                        }}
                    />
                    <VictoryAxis
                        orientation="bottom"
                        tickValues={plotData?.map((d) => d.temperature)}
                        tickFormat={(t) => `${t}°`}
                        style={{
                            tickLabels: { fontSize: 15 },
                            axis: { strokeWidth: 0, margin: 100 },
                        }}
                        offsetY={40}
                    />

                    <VictoryLine
                        data={plotData}
                        x="time"
                        y="temperature"
                        style={{ data: { stroke: "#ece9e9" } }}
                        interpolation={"natural"}
                    />

                    <VictoryScatter
                        data={plotData}
                        x="time"
                        y="temperature"
                        style={{ data: { fill: "white" } }}
                    />
                </VictoryChart>
            </div>
        )
    );
}
