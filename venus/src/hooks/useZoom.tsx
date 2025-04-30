import { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-maplibre";

export function useZoom(): number | null {
  const { current: map } = useMap();
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    if (!map) return;

    const updateZoom = () => {
      setZoom(map.getZoom());
    };

    updateZoom();

    map.on("zoomend", updateZoom);

    return () => {
      map.off("zoomend", updateZoom);
    };
  }, [map]);

  return zoom;
}
