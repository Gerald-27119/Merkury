import React from "react";

type WeatherTileProps = {
    className: string;
    children: React.ReactNode;
};

export default function WeatherTile({ className, children }: WeatherTileProps) {
    return (
        <div
            className={`bg-whiteSmoke h-28 rounded-md px-6 py-2 text-3xl shadow-md ${className}`}
        >
            {children}
        </div>
    );
}
