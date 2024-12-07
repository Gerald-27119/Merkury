import { IoSunny } from "react-icons/io5";
import { FiSunset } from "react-icons/fi";
import { FiSunrise } from "react-icons/fi";
import { RiArrowDownWideFill } from "react-icons/ri";
import { WiHumidity } from "react-icons/wi";
import { WiThermometer } from "react-icons/wi";
import { useState } from "react";

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
          {showDetails && (
            <div className="flex flex-col space-y-3 mt-3 ml-3">
              <div className="flex items-center text-xl space-x-3">
                <FiSunrise
                  size={40}
                  className="bg-gradient-to-b from-pink-500 via-red-500 to-orange-500 p-1 rounded-md"
                />
                <div>{weather.sunrise}</div>
              </div>
              <div className="flex items-center text-xl space-x-3">
                <FiSunset
                  size={40}
                  className="bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 p-1 rounded-md"
                />
                <div>{weather.sunset} </div>
              </div>
              <div className="flex items-center text-xl">
                <WiHumidity size={40} className="text-blue-500" />
                {weather.humidity}%
              </div>
            </div>
          )}
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
