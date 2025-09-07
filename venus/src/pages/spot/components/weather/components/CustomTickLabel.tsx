import React from "react";
import { VictoryLabel } from "victory";
import { formatISOToAmPm } from "../../../../../utils/weather";
import WeatherIcon from "../../../../map/components/weather/components/WeatherIcon";

export default function CustomTickLabel(props) {
    const { index, x, y, data } = props;
    const time = formatISOToAmPm(data.at(index).time.toString());
    const temp = `${data.at(index).temperature}°C`;

    return (
        <g transform={`translate(${x}, ${y})`}>
            <VictoryLabel
                x={0}
                y={0}
                dy={-20}
                textAnchor="middle"
                text={time}
                style={{ fontSize: 10, fill: "white" }}
            />
            <g transform="translate(-15, -13)">
                <WeatherIcon code={data.at(index).weatherCode} />
            </g>
            <VictoryLabel
                x={0}
                y={0}
                textAnchor="middle"
                text={temp}
                style={{ fontSize: 10, fill: "white" }}
                dy={20}
            />
        </g>
    );
}
