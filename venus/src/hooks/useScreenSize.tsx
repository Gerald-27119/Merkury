import { useEffect, useState } from "react";
import ScreenSizeDto from "../model/screenSizeDto";

export default function useScreenSize() {
    const [screenSize, setScreenSize] = useState<ScreenSizeDto>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return screenSize;
}
