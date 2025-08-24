import { useState } from "react";
import { BiWind } from "react-icons/bi";

export default function WindSpeedDisplay({ value }: { value: number }) {
    const [speedUnit, setSpeedUnit] = useState<string>("m/s");
    return (
        <div>
            <h3>
                <BiWind /> Wind Speed{" "}
            </h3>
            <span>{value}</span>
            <div>
                <button onClick={() => setSpeedUnit("m/s")}>m/s</button>
                <button onClick={() => setSpeedUnit("km/h")}>km/h</button>
            </div>
        </div>
    );
}
