import { useEffect, useState } from "react";
import WindSpeedRadioButton from "./WindSpeedRadioButton.jsx";
import WindSpeedColumn from "./WindSpeedColumn.jsx";

const availableHeights = [0, 100, 200, 500, 1000];

export default function WindSpeed({ winds }) {
  const [windSpeed, setWindSpeed] = useState(0);
  const [windHeight, setWindHeight] = useState({
    numberValue: 0,
    textValue: "0m",
  });
  const [heightError, setHeightError] = useState("");

  const changeWindHeightHandler = (e) => {
    let windHeight = e.target.value.replace("m", "");

    if (windHeight.startsWith("0") && windHeight.length > 1) {
      windHeight = windHeight.replace(/^0+/, "");
    }
    if (/^\d*$/.test(windHeight)) {
      setHeightError("");
      const parsedHeight = Math.min(Number(windHeight), 2000);
      setWindHeight((prevState) => ({
        ...prevState,
        numberValue: parsedHeight,
        textValue: `${parsedHeight}m`,
      }));
    } else {
      setWindHeight((prevState) => ({
        ...prevState,
        numberValue: 0,
        textValue: "0m",
      }));
      setHeightError("You can type only numbers greater than 0.");
    }
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
    if (winds) {
      const lower = winds
        .filter((wind) => wind.height <= windHeight.numberValue)
        .pop();
      const upper = winds.find((wind) => wind.height > windHeight.numberValue);

      if (lower && upper) {
        const interpolatedSpeed =
          lower.speed +
          ((windHeight.numberValue - lower.height) /
            (upper.height - lower.height)) *
            (upper.speed - lower.speed);

        setWindSpeed(interpolatedSpeed.toPrecision(2));
      } else if (lower) {
        setWindSpeed(lower.speed.toPrecision(2));
      } else if (upper) {
        setWindSpeed(upper.speed.toPrecision(2));
      } else {
        setWindSpeed(0);
      }
    } else {
      setWindSpeed(0);
    }
  }, [windHeight, winds]);

  return (
    <div className="flex flex-col p-4 bg-white rounded-xl shadow-md text-3xl flex-grow space-y-2">
      <div className="flex justify-around items-center">
        <input
          type="text"
          value={windHeight.textValue}
          onChange={changeWindHeightHandler}
          onBlur={formatHeightDisplay}
          onFocus={parseHeightInput}
          min={0}
          max={2000}
          className="py-2 px-4 shadow-md rounded-md w-1/3 focus:outline-none focus:ring-0 text-center flex-grow"
        />
        <p className="text-center flex-grow">{windSpeed} m/s</p>
      </div>
      <div className="flex items-center justify-around">
        <div className="flex flex-col w-1/2">
          <input
            type="range"
            min={0}
            max={2000}
            value={windHeight.numberValue}
            onChange={changeWindHeightHandler}
            className="appearance-none w-full h-2 py-2 bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 accent-slate-800"
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
