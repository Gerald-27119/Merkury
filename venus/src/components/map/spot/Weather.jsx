import { IoSunny } from "react-icons/io5";
import { RiArrowDownWideFill } from "react-icons/ri";
import { WiThermometer } from "react-icons/wi";
import { useState } from "react";
import WeatherDetails from "./WeatherDetails.jsx";

export default function Weather({ weather }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {weather ? (
        <div className="border border-violet-700 rounded-sm p-1 bg-sky-200">
          <div className="flex items-center justify-between">
            {weather.general === "sunny" && (
              <IoSunny size={40} className="text-yellow-300 ml-3" />
            )}
            <div className="right-0 mr-5 flex items-center">
              <WiThermometer size={30} className="text-red-400" />
              <div className="text-xl text-white">
                {weather.temperature}&deg;C
              </div>
            </div>
          </div>
          <div
            className={`transition-all duration-300 ${
              showDetails ? "max-h-screen" : "max-h-0"
            } overflow-hidden`}
          >
            {showDetails && (
              <WeatherDetails
                sunrise={weather.sunrise}
                sunset={weather.sunset}
                humidity={weather.humidity}
                winds={weather.winds}
              />
            )}
          </div>
          <div
            onClick={() => setShowDetails((prevState) => !prevState)}
            className="w-full mt-1 flex justify-center border border-sky-100 hover:bg-sky-100 cursor-pointer"
          >
            <RiArrowDownWideFill
              size={30}
              className={`transform transition-transform duration-300 ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      ) : (
        <div>No weather is available!</div>
      )}
    </>
  );
}
