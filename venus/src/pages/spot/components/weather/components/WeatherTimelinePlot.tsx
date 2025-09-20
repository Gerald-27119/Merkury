import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWeatherDataForTimelinePlot } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { parseWeatherData } from "../../../../../utils/weather";
import {
    VictoryAxis,
    VictoryChart,
    VictoryContainer,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
} from "victory";
import { useEffect, useState } from "react";
import SpotWeatherTimelinePlotData from "../../../../../model/interface/spot/weather/spotWeatherTimelinePlotData";
import CustomTickLabel from "./CustomTickLabel";
import useScreenSize from "../../../../../hooks/useScreenSize";
import ScreenSizeDto from "../../../../../model/screenSizeDto";

export default function WeatherTimelinePlot() {
    const [plotData, setPlotData] = useState<SpotWeatherTimelinePlotData[]>();
    const [plotSize, setPlotSize] = useState<ScreenSizeDto>({
        width: 5000,
        height: 400,
    });

    const screenSize = useScreenSize();

    useEffect(() => {
        if (screenSize.height <= 1080 || screenSize.width <= 1920) {
            setPlotSize({ width: 5000, height: 360 });
        }
    }, [screenSize]);

    const { latitude, longitude } = useSelectorTyped(
        (state) => state.spotWeather,
    );

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
            <div className="3xl:mt-8 mt-2">
                <h2 className="text-2xl">Timeline</h2>
                <div className="bg-mediumDarkBlue text-darkText scrollbar-thin scrollbar-track-rounded-lg scrollbar-track-sky-950 hover:scrollbar-thumb-sky-800 scrollbar-thumb-rounded-full mx-auto mt-4 w-[27.5rem] overflow-x-auto rounded-lg">
                    <VictoryChart
                        domain={{
                            x: [
                                new Date(
                                    Math.min(
                                        ...plotData.map((d) =>
                                            new Date(d.time).getTime(),
                                        ),
                                    ),
                                ),
                                new Date(
                                    Math.max(
                                        ...plotData.map((d) =>
                                            new Date(d.time).getTime(),
                                        ),
                                    ),
                                ),
                            ],
                            y: [
                                Math.min(
                                    ...plotData.map((d) => d.temperature),
                                ) - 2,
                                Math.max(
                                    ...plotData.map((d) => d.temperature),
                                ) + 2,
                            ],
                        }}
                        scale={{ x: "time" }}
                        theme={VictoryTheme.clean}
                        padding={{ top: 80, bottom: 60, left: 50, right: 50 }}
                        width={plotSize.width}
                        height={plotSize.height}
                        containerComponent={
                            <VictoryContainer responsive={false} />
                        }
                    >
                        <VictoryAxis
                            orientation="top"
                            tickValues={plotData.map((d) => new Date(d.time))}
                            tickFormat={() => ""}
                            tickLabelComponent={
                                <CustomTickLabel data={plotData} />
                            }
                            style={{
                                tickLabels: { fontSize: 12 },
                                axis: { strokeWidth: 0 },
                            }}
                        />

                        <VictoryLine
                            data={plotData.map((d) => {
                                return {
                                    x: new Date(d.time),
                                    y: d.temperature,
                                };
                            })}
                            style={{ data: { stroke: "#ece9e9" } }}
                            interpolation={"natural"}
                        />

                        <VictoryScatter
                            data={plotData.map((d) => {
                                return {
                                    x: new Date(d.time),
                                    y: d.temperature,
                                };
                            })}
                            style={{ data: { fill: "white" } }}
                        />
                    </VictoryChart>
                </div>
            </div>
        )
    );
}
