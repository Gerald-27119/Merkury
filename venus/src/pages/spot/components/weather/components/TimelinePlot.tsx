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
import CustomTickLabel from "./CustomTickLabel";

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
    console.log(plotData);
    return (
        isSuccess &&
        plotData && (
            <div className="bg-mediumDarkBlue text-darkText cursor-grab">
                <VictoryChart
                    scale={{ x: "time" }}
                    theme={VictoryTheme.clean}
                    padding={{ top: 80, bottom: 80, left: 50, right: 50 }}
                    containerComponent={
                        <VictoryZoomContainer
                            zoomDomain={{
                                x: [
                                    new Date(plotData[0].time),
                                    new Date(
                                        plotData[plotData.length - 67].time,
                                    ),
                                ],
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
                        tickValues={plotData.map((d) => new Date(d.time))}
                        tickLabelComponent={<CustomTickLabel data={plotData} />}
                        style={{
                            tickLabels: { fontSize: 12 },
                            axis: { strokeWidth: 0 },
                        }}
                    />
                    <VictoryAxis dependentAxis={true} />

                    <VictoryLine
                        data={plotData.map((d) => {
                            return {
                                x: new Date(d.time.toString()),
                                y: d.temperature,
                            };
                        })}
                        style={{ data: { stroke: "#ece9e9" } }}
                        interpolation={"natural"}
                        // x="time"
                        // y="temperature"
                    />

                    <VictoryScatter
                        data={plotData.map((d) => {
                            return {
                                x: new Date(d.time.toString()),
                                y: d.temperature,
                            };
                        })}
                        style={{ data: { fill: "white" } }}
                        // x="time"
                        // y="temperature"
                    />
                </VictoryChart>
            </div>
        )
    );
}
