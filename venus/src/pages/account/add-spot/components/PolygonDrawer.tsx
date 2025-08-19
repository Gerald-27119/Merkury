import { useState } from "react";
import { Map, Source, Layer } from "@vis.gl/react-maplibre";
import { ButtonVariantType } from "../../../../model/enum/buttonVariantType";
import Button from "../../../../components/buttons/Button";

interface PolygonDrawerProps {
    onPolygonComplete: (coords: number[][][]) => void;
    initialPosition?: { longitude: number; latitude: number };
}

export default function PolygonDrawer({
    onPolygonComplete,
    initialPosition,
}: PolygonDrawerProps) {
    const [polygonCoords, setPolygonCoords] = useState<number[][]>([]);

    const handleClick = (event: any) => {
        const { lng, lat } = event.lngLat;
        setPolygonCoords((prev) => [...prev, [lng, lat]]);
    };

    const undoLastPoint = () => {
        setPolygonCoords((prev) => prev.slice(0, -1));
    };

    const finishPolygon = () => {
        if (polygonCoords.length > 2) {
            const closedCoords = [...polygonCoords, polygonCoords[0]];
            const polygonGeoJSON = {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [closedCoords],
                },
                properties: {},
            };
            onPolygonComplete(polygonGeoJSON.geometry.coordinates);
        }
    };

    return (
        <div className="h-170 w-full">
            <Map
                initialViewState={{
                    longitude: initialPosition?.longitude ?? 18.64745,
                    latitude: initialPosition?.latitude ?? 54.352553,
                    zoom: 15,
                }}
                style={{ width: "100%", height: "100%", borderRadius: "16px" }}
                mapStyle="/map_style1.json"
                onClick={handleClick}
            >
                {polygonCoords.length > 0 && (
                    <Source
                        id="polygon"
                        type="geojson"
                        data={{
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [
                                    [...polygonCoords, polygonCoords[0]],
                                ],
                            },
                            properties: {},
                        }}
                    >
                        <Layer
                            id="polygon-fill"
                            type="fill"
                            paint={{
                                "fill-color": "#888",
                                "fill-opacity": 0.4,
                            }}
                        />
                        <Layer
                            id="polygon-outline"
                            type="line"
                            paint={{ "line-color": "#000", "line-width": 2 }}
                        />
                    </Source>
                )}
            </Map>
            <div className="mt-2 flex space-x-2">
                <Button
                    variant={ButtonVariantType.MODAL}
                    onClick={undoLastPoint}
                    className="text-darkText bg-red-600 hover:bg-red-700"
                >
                    Undo Last Point
                </Button>
                <Button
                    variant={ButtonVariantType.MODAL}
                    onClick={finishPolygon}
                    className="bg-violetDark text-darkText hover:bg-violetDark/80"
                >
                    Finish Polygon
                </Button>
            </div>
        </div>
    );
}
