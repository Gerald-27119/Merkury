import { useEffect, useState } from "react";
import WindSpeedRadioButton from "./WindSpeedRadioButton.jsx";
import WindSpeedColumn from "./WindSpeedColumn.jsx";
import { calculateWindSpeed } from "../../../../../utils/weather.jsx";

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
    const parsedHeight = isValidNumber ? Math.min(Number(windHeight), 2000) : 0;

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
    <div className="flex flex-col p-4 bg-white rounded-xl shadow-md text-3xl grow space-y-2">
      <div className="flex justify-around items-center">
        <input
          type="text"
          value={windHeight.textValue}
          onChange={changeWindHeightHandler}
          onBlur={formatHeightDisplay}
          onFocus={parseHeightInput}
          min={0}
          max={2000}
          className="py-2 px-4 shadow-md rounded-md w-1/3 focus:outline-hidden focus:ring-0 text-center grow"
        />
        <p className="text-center grow">{windSpeed} m/s</p>
      </div>
      <div className="flex items-center justify-around">
        <div className="flex flex-col w-1/2">
          <input
            type="range"
            min={0}
            max={2000}
            value={windHeight.numberValue}
            onChange={changeWindHeightHandler}
            className="appearance-none w-full h-2 py-2 bg-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-300 accent-slate-800"
          />
          <p className="text-red-500 font-semibold text-base mt-2">
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
