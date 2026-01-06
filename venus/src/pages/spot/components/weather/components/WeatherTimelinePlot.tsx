import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getWeatherDataForTimelinePlot } from "../../../../../http/weather";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import {
    VictoryAxis,
    VictoryChart,
    VictoryContainer,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
} from "victory";
import CustomTickLabel from "./CustomTickLabel";

const VIRTUAL_Y_MIN = 0;
const VIRTUAL_Y_MAX = 100;

export default function WeatherTimelinePlot() {
    const { latitude, longitude } = useSelectorTyped(
        (state) => state.spotWeather,
    );

    const { spotId } = useSelectorTyped((state) => state.spotDetails);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: [
            "spot-weather",
            "timeline-plot",
            latitude,
            longitude,
            spotId,
        ],
        queryFn: () =>
            getWeatherDataForTimelinePlot(latitude, longitude, spotId!),
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <p>Failed to load data for timeline plot.</p>;
    }

    const actualMin = data
        ? Math.min(...data.map((d) => d.temperature)) - 1
        : 0;
    const actualMax = data
        ? Math.max(...data.map((d) => d.temperature)) + 1
        : 100;
    const span = actualMax - actualMin || 1;
    const mapY = (temp: number) =>
        VIRTUAL_Y_MIN +
        ((temp - actualMin) / span) * (VIRTUAL_Y_MAX - VIRTUAL_Y_MIN);

    return (
        isSuccess &&
        data && (
            <div className="3xl:mt-8 mt-2">
                <h2 className="text-2xl">Timeline</h2>
                <div className="bg-mediumDarkBlue text-darkText scrollbar-thin scrollbar-track-rounded-lg scrollbar-track-sky-950 hover:scrollbar-thumb-sky-800 scrollbar-thumb-sky-700 scrollbar-thumb-rounded-full scroll-grab mx-auto mt-4 w-[27.5rem] overflow-x-auto rounded-lg">
                    <VictoryChart
                        domain={{
                            x: [
                                new Date(
                                    Math.min(
                                        ...data.map((d) =>
                                            new Date(d.time).getTime(),
                                        ),
                                    ),
                                ),
                                new Date(
                                    Math.max(
                                        ...data.map((d) =>
                                            new Date(d.time).getTime(),
                                        ),
                                    ),
                                ),
                            ],
                            y: [VIRTUAL_Y_MIN, VIRTUAL_Y_MAX],
                        }}
                        scale={{ x: "time" }}
                        theme={VictoryTheme.clean}
                        padding={{ top: 90, bottom: 60, left: 50, right: 50 }}
                        width={5000}
                        height={460}
                        containerComponent={
                            <VictoryContainer responsive={false} />
                        }
                    >
                        <VictoryAxis
                            orientation="top"
                            tickValues={data.map((d) => new Date(d.time))}
                            tickLabelComponent={<CustomTickLabel data={data} />}
                            style={{
                                tickLabels: { fontSize: 12 },
                                axis: { strokeWidth: 0 },
                            }}
                        />

                        <VictoryLine
                            data={data.map((d) => {
                                return {
                                    x: new Date(d.time),
                                    y: mapY(d.temperature),
                                };
                            })}
                            style={{ data: { stroke: "#ece9e9" } }}
                            interpolation={"natural"}
                        />

                        <VictoryScatter
                            data={data.map((d) => {
                                return {
                                    x: new Date(d.time),
                                    y: mapY(d.temperature),
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
