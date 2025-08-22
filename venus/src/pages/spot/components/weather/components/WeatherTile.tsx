import React from "react";

type WeatherTileProps = {
    className: string;
    children: React.ReactNode;
};

export default function WeatherTile({ className, children }: WeatherTileProps) {
    return (
        <div
            className={`rounded-md bg-white px-6 py-2 text-2xl shadow-md ${className}`}
        >
            {children}
        </div>
    );
}
