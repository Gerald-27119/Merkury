import { FaPlus, FaMinus } from "react-icons/fa";
import React from "react";
import { useMap } from "@vis.gl/react-maplibre";
import ZoomControlButton from "./ZoomControlButton";

export default function ZoomControlPanel() {
    const { current: map } = useMap();
    const handleZoomIn = () => {
        map?.zoomIn();
    };
    const handleZoomOut = () => {
        map?.zoomOut();
    };

    return (
        <div
            data-testid="zoom-panel"
            className="dark:text-darkText text-violetBright flex flex-col rounded-3xl text-sm lg:text-lg xl:text-xl"
        >
            <ZoomControlButton isZoomInBtn={true} handleZoom={handleZoomIn}>
                <FaPlus />
            </ZoomControlButton>
            <hr className="dark:bg-violetLight bg-violetDark h-0.5 w-full" />
            <ZoomControlButton isZoomInBtn={false} handleZoom={handleZoomOut}>
                <FaMinus />
            </ZoomControlButton>
        </div>
    );
}
