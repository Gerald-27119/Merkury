import GeneralSpot from "../model/interface/spot/generalSpot";
import type { FeatureCollection } from "geojson";

type RenderCondition = {
    maxZoom: number;
    maxArea: number;
};

export function formatPublishDate(publishDate) {
    const date = new Date(publishDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function createGeoJson(spot: GeneralSpot): FeatureCollection {
    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            ...spot.contourCoordinates.map(
                                ([latitude, longitude]: number[]) => [
                                    longitude,
                                    latitude,
                                ],
                            ),
                        ],
                    ],
                },
                properties: {},
            },
        ],
    };
}

const renderConditions: RenderCondition[] = [
    { maxZoom: 14, maxArea: 70000 },
    { maxZoom: 12, maxArea: 160000 },
];

export function shouldRenderMarker(area: number, zoomLevel: number): boolean {
    return renderConditions.some(
        (condition) =>
            zoomLevel < condition.maxZoom && area < condition.maxArea,
    );
}

export function calculateDistanceInMeters(
    userLocation: { longitude: number; latitude: number },
    spotLocation: { longitude: number; latitude: number },
): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const earthRadius = 6371000;

    const lat1 = toRadians(userLocation.latitude);
    const lat2 = toRadians(spotLocation.latitude);
    const deltaLat = toRadians(spotLocation.latitude - userLocation.latitude);
    const deltaLng = toRadians(spotLocation.longitude - userLocation.longitude);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLng / 2) *
            Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(earthRadius * c);
}

export function getUserLocation(): Promise<{
    latitude: number;
    longitude: number;
}> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => reject(error),
            );
        }
    });
}
