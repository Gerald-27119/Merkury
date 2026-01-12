import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

interface SpotMapProps {
    lat: number;
    lng: number;
}

export default function SpotMap({ lat, lng }: SpotMapProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        if (!mapRef.current) {
            mapRef.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "/map_style.json",
                center: [lng, lat],
                zoom: 14,
                attributionControl: false,
            });

            new maplibregl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [lat, lng]);

    return <div ref={mapContainer} className="h-70 w-80 rounded-md" />;
}
