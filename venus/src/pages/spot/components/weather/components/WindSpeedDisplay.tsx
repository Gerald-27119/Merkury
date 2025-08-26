import { useState } from "react";
import { BiWind } from "react-icons/bi";

const buttonBaseClasses: string = "cursor-pointer px-3";

export default function WindSpeedDisplay({ value }: { value: number }) {
    const [speedUnit, setSpeedUnit] = useState<string>("m/s");

    const speedValue = speedUnit === "km/h" ? value * 3.6 : value;

    return (
        <div className="ml-3 w-full">
            <h3 className="flex items-center space-x-1 text-xl">
                <BiWind />
                <p>Wind Speed</p>
            </h3>
            <div className="flex items-baseline">
                <span className="text-6xl">{speedValue}</span>
                <span className="text-4xl">{speedUnit}</span>
            </div>
            <div className="mx-auto mt-2 flex w-full items-center">
                <button
                    className={`${speedUnit === "m/s" ? "bg-paleBlueGray/30" : "bg-lightGrayishBlue"} rounded-l-2xl ${buttonBaseClasses}`}
                    onClick={() => setSpeedUnit("m/s")}
                >
                    m/s
                </button>
                <button
                    className={`${speedUnit === "km/h" ? "bg-paleBlueGray/30" : "bg-lightGrayishBlue"} rounded-r-2xl ${buttonBaseClasses}`}
                    onClick={() => setSpeedUnit("km/h")}
                >
                    km/h
                </button>
            </div>
        </div>
    );
}
