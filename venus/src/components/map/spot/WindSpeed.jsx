import { useEffect, useState } from "react";
import WindSpeedRadioButton from "./WindSpeedRadioButton.jsx";

export default function WindSpeed({ winds }) {
  const [windSpeed, setWindSpeed] = useState(0);
  const [windHeight, setWindHeight] = useState(0);
  const [heightError, setHeightError] = useState("sda");

  const changeWindHeightHandler = (e) => {
    let windHeight = e.target.value;

    if (windHeight.startsWith("0") && windHeight.length > 1) {
      windHeight = windHeight.replace(/^0+/, "");
    }
    if (/^\d*$/.test(windHeight)) {
      setHeightError("");
      if (windHeight > 2000) {
        setWindHeight(2000);
      } else {
        setWindHeight(windHeight);
      }
    } else {
      setWindHeight(0);
      setHeightError("You can type only numbers greater than 0.");
    }
  };

  useEffect(() => {
    if (winds) {
      const lower = winds.filter((wind) => wind.height <= windHeight).pop();
      const upper = winds.find((wind) => wind.height > windHeight);

      if (lower && upper) {
        const interpolatedSpeed =
          lower.speed +
          ((windHeight - lower.height) / (upper.height - lower.height)) *
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
          type="number"
          value={windHeight}
          onChange={changeWindHeightHandler}
          min={0}
          max={2000}
          pattern="[0-9]*"
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
            value={windHeight}
            onChange={changeWindHeightHandler}
          />
          <p className="text-red-500 font-semibold text-base mt-2">
            {heightError}
          </p>
        </div>
        <div className="flex gap-4 text-xl">
          <div className="flex flex-col">
            <WindSpeedRadioButton
              value={0}
              onChange={changeWindHeightHandler}
              windHeight={windHeight}
            />
            <WindSpeedRadioButton
              value={100}
              onChange={changeWindHeightHandler}
              windHeight={windHeight}
            />
            <WindSpeedRadioButton
              value={200}
              onChange={changeWindHeightHandler}
              windHeight={windHeight}
            />
          </div>
          <div className="flex flex-col">
            <WindSpeedRadioButton
              value={500}
              onChange={changeWindHeightHandler}
              windHeight={windHeight}
            />
            <WindSpeedRadioButton
              value={1000}
              onChange={changeWindHeightHandler}
              windHeight={windHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
