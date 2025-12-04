import React from "react";

type WeatherTileProps = {
    className: string;
    children: React.ReactNode;
};

export default function WeatherTile({ className, children }: WeatherTileProps) {
    return (
        <div
            className={`bg-whiteSmoke dark:bg-second 3xl:h-28 3xl:px-6 h-24 rounded-md px-5 py-2 text-3xl shadow-md ${className}`}
        >
            {children}
        </div>
    );
}
