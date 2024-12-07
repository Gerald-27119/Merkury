import { IoSunny } from "react-icons/io5";
import { FiSunset } from "react-icons/fi";
import { FiSunrise } from "react-icons/fi";

export default function Weather({ weather }) {
  return (
    <>
      {weather ? (
        <div className="border border-violet-700 rounded-sm">
          <div className="flex">
            {weather.general === "sunny" && (
              <IoSunny size={20} className="text-yellow-300" />
            )}
            <div>{weather.temperature}&deg;C</div>
          </div>
          <div>
            <div className="flex">
              <FiSunrise />
              {weather.sunrise}
            </div>
            <div className="flex">
              <FiSunset />
              {weather.sunset}
            </div>
          </div>
        </div>
      ) : (
        <div>No weather is available!</div>
      )}
    </>
  );
}
