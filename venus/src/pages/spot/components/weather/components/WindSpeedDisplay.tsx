import { useState } from "react";
import { BiWind } from "react-icons/bi";

const buttonBaseClasses: string = "cursor-pointer relative";

export default function WindSpeedDisplay({ value }: { value: number }) {
    const [speedUnit, setSpeedUnit] = useState<string>("m/s");

    const speedValue = speedUnit === "km/h" ? value * 3.6 : value;

    return (
        <div className="ml-3 w-48">
            <h3 className="mb-2 flex items-center space-x-1 text-xl">
                <BiWind />
                <p>Wind Speed</p>
            </h3>
            <div className="flex items-baseline">
                <span className="text-6xl">{speedValue.toFixed(1)}</span>
                <span className="text-3xl">{speedUnit}</span>
            </div>
            <div className="mt-4 flex w-full items-center justify-center">
                <button
                    className={`${speedUnit === "m/s" ? "bg-paleBlueGray/30" : "bg-lightGrayishBlue"} rounded-l-2xl px-4 ${buttonBaseClasses}`}
                    onClick={() => setSpeedUnit("m/s")}
                >
                    m/s
                </button>
                <hr className="absolute left-28 z-50 h-5 w-1 rounded-full bg-white" />
                <button
                    className={`${speedUnit === "km/h" ? "bg-paleBlueGray/30" : "bg-lightGrayishBlue"} rounded-r-2xl px-3 ${buttonBaseClasses}`}
                    onClick={() => setSpeedUnit("km/h")}
                >
                    km/h
                </button>
            </div>
        </div>
    );
}
