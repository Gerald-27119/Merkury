import React from "react";
import { VictoryLabel } from "victory";
import { formatISOToAmPm } from "../../../../../utils/weather";
import WeatherIcon from "../../../../map/components/weather/components/WeatherIcon";
import { WiRaindrop } from "react-icons/wi";

export default function CustomTickLabel(props) {
    const { index, x, y, data } = props;
    const time = formatISOToAmPm(data.at(index).time);
    const temp = `${data.at(index).temperature}°C`;
    const precipitationProbability = `${data.at(index).precipitationProbability}%`;
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
            <g transform="translate(-17, 180)">
                <WiRaindrop size={25} className="text-slate-400" />
                <text
                    x="20"
                    y="17"
                    fill="#94a3b8"
                    fontSize="15"
                    textAnchor="start"
                >
                    {precipitationProbability}
                </text>
            </g>
        </g>
    );
}
