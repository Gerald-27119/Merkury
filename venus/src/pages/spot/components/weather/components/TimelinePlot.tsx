import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWeatherDataForTimelinePlot } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import {
    formatISOToAmPm,
    parseWeatherData,
} from "../../../../../utils/weather";
import {
    VictoryAxis,
    VictoryChart,
    VictoryContainer,
    VictoryLabel,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
    VictoryZoomContainer,
} from "victory";
import { useEffect, useState } from "react";
import SpotWeatherTimelinePlotData from "../../../../../model/interface/spot/weather/spotWeatherTimelinePlotData";
import WeatherIcon from "../../../../map/components/weather/components/WeatherIcon";

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
        isSuccess && (
            <div>
                <VictoryChart
                    width={1000}
                    height={400}
                    scale={{ x: "time" }}
                    theme={VictoryTheme.clean}
                    padding={{ top: 80, bottom: 80, left: 50, right: 50 }}
                    containerComponent={
                        <VictoryZoomContainer
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
                        style={{ tickLabels: { fontSize: 12 } }}
                    />

                    <VictoryLine
                        data={plotData}
                        x="time"
                        y="temperature"
                        style={{ data: { stroke: "#0d0db5" } }}
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
