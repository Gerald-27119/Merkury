import { VictoryLabel } from "victory";
import { formatISOToAmPm } from "../../../../../utils/weather";
import WeatherIcon from "../../../../map/components/weather/components/WeatherIcon";
import { WiRaindrop } from "react-icons/wi";

export default function CustomTickLabel(props: any) {
    const { index, x, y, data } = props;
    const time = formatISOToAmPm(data.at(index).time);
    const temperature = `${data.at(index).temperature}°C`;
    const precipitationProbability = `${data.at(index).precipitationProbability}%`;

    return (
        <g transform={`translate(${x}, ${y})`}>
            <VictoryLabel
                x={0}
                y={0}
                dy={-40}
                textAnchor="middle"
                text={time}
                style={{ fontSize: 13, fill: "white" }}
            />
            <g transform="translate(-18, -30)">
                <WeatherIcon
                    code={data.at(index).weatherCode}
                    textSize={"text-4xl"}
                    isDay={data.at(index).isDay}
                />
            </g>
            <VictoryLabel
                x={0}
                y={0}
                textAnchor="middle"
                text={temperature}
                style={{ fontSize: 13, fill: "white" }}
                dy={15}
            />
            <g transform="translate(-17, 330)">
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
