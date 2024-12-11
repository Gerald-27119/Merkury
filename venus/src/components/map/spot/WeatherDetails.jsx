import { FiSunrise, FiSunset } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { GiWindsock } from "react-icons/gi";
import { useEffect, useMemo, useState } from "react";

export default function WeatherDetails({ sunrise, sunset, humidity, winds }) {
  const maxHeight = useMemo(
    () => Math.max(...winds.map((wind) => wind.height)),
    [winds],
  );

  const initialWindSpeed = useMemo(() => winds[0].speed, [winds]);

  const [enteredHeight, setEnteredHeight] = useState(0);
  const [windSpeed, setWindSpeed] = useState(initialWindSpeed);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const wind = winds.find((wind) => wind.height === enteredHeight);
    if (wind) {
      setWindSpeed(wind.speed);
    }
  }, [enteredHeight, winds]);

  const handleHeightChange = (event) => {
    setIsError(false);
    const inputValue = event.target.value.replace(/\s*m$/, "");
    if (!inputValue || isNaN(inputValue)) {
      setIsError(true);
      return;
    }
    const value = Number.parseInt(inputValue);

    if (value < 0) {
      setIsError(true);
      return;
    }

    setEnteredHeight(value);
  };

  return (
    <div className="flex justify-between items-center space-x-7">
      <div className="flex flex-col space-y-3 mt-3 ml-3">
        <div className="flex items-center text-xl space-x-3">
          <FiSunrise
            size={40}
            className="bg-gradient-to-b from-pink-500 via-red-500 to-orange-500 p-1 rounded-md"
          />
          <time>{sunrise}</time>
        </div>
        <div className="flex items-center text-xl space-x-3">
          <FiSunset
            size={40}
            className="bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 p-1 rounded-md"
          />
          <time>{sunset}</time>
        </div>
        <div className="flex items-center text-xl">
          <WiHumidity size={40} className="text-blue-500" />
          {humidity}%
        </div>
      </div>
      <div className="flex-col space-y-3">
        <div className="flex justify-center">
          <GiWindsock
            size={40}
            className="text-red-600 bg-white rounded-md p-1"
          />
        </div>
        <div className="flex">
          <p className="text-lg">Speed:&nbsp;</p>
          <div className="w-fit bg-white text-lg text-center px-1">
            {windSpeed}&nbsp;m/s
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={maxHeight}
          value={enteredHeight}
          onChange={(event) => handleHeightChange(event)}
          className="w-full"
        />
        <div className="flex">
          <p className="text-lg">Height:&nbsp;</p>
          <input
            type="text"
            value={`${enteredHeight} m`}
            onChange={(event) => handleHeightChange(event)}
            className="w-1/3 text-lg text-center"
          />
        </div>
        {isError && (
          <p className="text-red-500 text-sm">Invalid height value</p>
        )}
      </div>
    </div>
  );
}
