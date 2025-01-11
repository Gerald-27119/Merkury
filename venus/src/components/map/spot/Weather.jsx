import { RiArrowDownWideFill } from "react-icons/ri";
import { WiThermometer } from "react-icons/wi";
import { useState } from "react";
import WeatherDetails from "./WeatherDetails.jsx";
import GeneralWeather from "./GeneralWeather.jsx";

export default function Weather({ weather }) {
  const [showDetails, setShowDetails] = useState(false);
  console.log(weather);
  return (
    <>
      {weather ? (
        <div className="border border-violet-700 rounded-sm p-1 bg-sky-200">
          <div className="flex items-center justify-between">
            <GeneralWeather generalWeather={weather.current.type} />
            <div className="right-0 mr-5 flex items-center">
              <WiThermometer size={30} className="text-red-400" />
              <p className="text-xl text-white">
                {weather.current.temperature2m}&deg;C
              </p>
            </div>
          </div>
          <div
            className={`transition-all duration-300 ${
              showDetails ? "max-h-screen" : "max-h-0"
            } overflow-hidden`}
          >
            {showDetails && (
              <WeatherDetails
                sunrise={weather.daily.sunrise}
                sunset={weather.daily.sunset}
                humidity={weather.current.relativeHumidity2m}
                winds={weather.hourly.winds}
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
        <p>No weather is available!</p>
      )}
    </>
  );
}
