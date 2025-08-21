import { useEffect, useState } from "react";
import WindSpeedRadioButton from "./WindSpeedRadioButton.jsx";
import WindSpeedColumn from "./WindSpeedColumn.jsx";
import { calculateWindSpeed } from "../../../../../utils/weather.tsx";

const availableHeights = [0, 100, 200, 500, 1000];

export default function WindSpeed({ winds }) {
    const [windSpeed, setWindSpeed] = useState(0);
    const [windHeight, setWindHeight] = useState({
        numberValue: 0,
        textValue: "0m",
    });
    const [heightError, setHeightError] = useState("");

    const changeWindHeightHandler = (e) => {
        let windHeight = e.target.value.replace("m", "").replace(/^0+/, "");

        const isValidNumber = /^\d*$/.test(windHeight);
        const parsedHeight = isValidNumber
            ? Math.min(Number(windHeight), 2000)
            : 0;

        setWindHeight((prevState) => ({
            ...prevState,
            numberValue: parsedHeight,
            textValue: `${parsedHeight}m`,
        }));

        setHeightError(
            isValidNumber ? "" : "You can type only numbers greater than 0.",
        );
    };

    const formatHeightDisplay = () => {
        setWindHeight((prevState) => ({
            ...prevState,
            textValue: `${prevState.numberValue}m`,
        }));
    };

    const parseHeightInput = () => {
        setWindHeight((prevState) => ({
            ...prevState,
            textValue: prevState.numberValue.toString(),
        }));
    };

    useEffect(() => {
        setWindSpeed(calculateWindSpeed(winds, windHeight));
    }, [windHeight, winds]);

    return (
        <div className="flex grow flex-col space-y-2 rounded-xl bg-white p-4 text-3xl shadow-md">
            <div className="flex items-center justify-around">
                <input
                    type="text"
                    value={windHeight.textValue}
                    onChange={changeWindHeightHandler}
                    onBlur={formatHeightDisplay}
                    onFocus={parseHeightInput}
                    min={0}
                    max={2000}
                    className="w-1/3 grow rounded-md px-4 py-2 text-center shadow-md focus:ring-0 focus:outline-hidden"
                />
                <p className="grow text-center">{windSpeed} m/s</p>
            </div>
            <div className="flex items-center justify-around">
                <div className="flex w-1/2 flex-col">
                    <input
                        type="range"
                        min={0}
                        max={2000}
                        value={windHeight.numberValue}
                        onChange={changeWindHeightHandler}
                        className="h-2 w-full appearance-none rounded-md bg-slate-200 py-2 accent-slate-800 focus:ring-2 focus:ring-slate-300 focus:outline-hidden"
                    />
                    <p className="mt-2 text-base font-semibold text-red-500">
                        {heightError}
                    </p>
                </div>
                <div className="flex gap-4 text-xl">
                    <WindSpeedColumn>
                        {availableHeights.slice(0, 3).map((value) => (
                            <WindSpeedRadioButton
                                key={value}
                                value={value}
                                onChange={changeWindHeightHandler}
                                windHeight={windHeight.numberValue}
                                allValues={availableHeights}
                            />
                        ))}
                    </WindSpeedColumn>
                    <WindSpeedColumn>
                        {availableHeights.slice(3).map((value) => (
                            <WindSpeedRadioButton
                                key={value}
                                value={value}
                                onChange={changeWindHeightHandler}
                                windHeight={windHeight.numberValue}
                                allValues={availableHeights}
                            />
                        ))}
                    </WindSpeedColumn>
                </div>
            </div>
        </div>
    );
}
