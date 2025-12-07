import GeneralSpot from "../model/interface/spot/generalSpot";
import type { FeatureCollection } from "geojson";

type RenderCondition = {
    maxZoom: number;
    maxArea: number;
};

export function calculateRateStarSize(
    screenWidth: number,
    screenHeight: number,
): number {
    if (screenHeight <= 1080 && screenWidth <= 1920) return 21;
    else if (screenHeight < 1440 && screenWidth < 2560) return 24;
    else return 27;
}

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
