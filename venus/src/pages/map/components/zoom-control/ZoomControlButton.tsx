import React from "react";

type ZoomControlButtonProps = {
  isZoomInBtn: boolean;
  handleZoom: () => void;
  children: React.ReactNode;
};

const btnClasses: string =
  "cursor-pointer w-full p-4 dark:bg-violetDarker bg-fifth hover:dark:bg-violetDark hover:bg-lightBgButed";
const zoomInBtnClasses: string = "rounded-t-full inset-shadow-sm";
const zoomOutBtnClasses: string = "rounded-b-full shadow-lg";

export default function ZoomControlButton({
  isZoomInBtn,
  handleZoom,
  children,
}: ZoomControlButtonProps) {
  return (
    <button
      onClick={handleZoom}
      className={`${btnClasses} ${isZoomInBtn ? zoomInBtnClasses : zoomOutBtnClasses}`}
      data-testid={`zoom-${isZoomInBtn ? "in" : "out"}-btn`}
    >
      {children}
    </button>
  );
}
