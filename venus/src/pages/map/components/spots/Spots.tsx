import { useMutation, useQuery } from "@tanstack/react-query";
import {
    fetchFilteredSpots,
    increaseSpotViewsCount,
} from "../../../../http/spots-data.js";
import { useEffect } from "react";
import { notificationAction } from "../../../../redux/notification";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { Layer, Marker, Source, useMap } from "@vis.gl/react-maplibre";
import {
    createGeoJson,
    shouldRenderMarker,
} from "../../../../utils/spot-utils";
import GeneralSpot from "../../../../model/interface/spot/generalSpot";
import { AxiosError } from "axios";
import { MdLocationPin } from "react-icons/md";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { spotDetailsModalAction } from "../../../../redux/spot-modal";
import { useLocation, useSearchParams } from "react-router-dom";
import SpotCoordinatesDto from "../../../../model/interface/spot/coordinates/spotCoordinatesDto";
import { spotWeatherActions } from "../../../../redux/spot-weather";
import { currentViewSpotsListModalActions } from "../../../../redux/current-view-spots-list-modal";
import { searchedSpotListModalAction } from "../../../../redux/searched-spot-list-modal";

const clickHandlers = new Map<number, () => void>();

export default function Spots() {
    const { name } = useSelectorTyped((state) => state.spotFilters);
    const { zoomLevel } = useSelectorTyped((state) => state.map);
    const dispatch = useDispatchTyped();
    const { current: map } = useMap();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const { mutateAsync } = useMutation({
        mutationKey: ["increase-spot-views-count"],
        mutationFn: increaseSpotViewsCount,
        onError: () => {},
    });

    const { data, error } = useQuery({
        queryFn: () => fetchFilteredSpots(name),
        queryKey: ["spots", "filter", name],
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    useEffect(() => {
        const axiosError = error as AxiosError<any>;
        if (axiosError?.response?.data) {
            const message =
                axiosError.response?.data?.message || axiosError.response?.data;
            dispatch(
                notificationAction.addError({
                    message,
                }),
            );
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (!map) return;

        const handleMouseEnter = () => {
            map.getCanvas().style.cursor = "pointer";
        };
        const handleMouseLeave = () => {
            map.getCanvas().style.cursor = "";
        };

        if (data) {
            data?.forEach((spot: GeneralSpot) => {
                if (!shouldRenderMarker(spot.area, zoomLevel)) {
                    const handler = () =>
                        handleSpotClick(
                            spot.id,
                            spot.centerPoint,
                            spot.region,
                            spot.city,
                        );
                    const layerId = spot.id.toString();
                    clickHandlers.set(spot.id, handler);
                    map?.on("click", layerId, handler);
                    map?.on("mouseenter", layerId, handleMouseEnter);
                    map?.on("mouseleave", layerId, handleMouseLeave);
                }
            });
        }
        return () => {
            if (data) {
                data?.forEach((spot: GeneralSpot) => {
                    if (!shouldRenderMarker(spot.area, zoomLevel)) {
                        const handler = clickHandlers.get(spot.id);
                        const layerId = spot.id.toString();
                        if (handler) {
                            map?.off("click", layerId, handler);
                            clickHandlers.delete(spot.id);
                        }
                        map?.off("mouseenter", layerId, handleMouseEnter);
                        map?.off("mouseleave", layerId, handleMouseLeave);
                        map.getCanvas().style.cursor = "";
                    }
                });
            }
        };
    }, [map, data, zoomLevel]);

    useEffect(() => {
        if (!map || !location.state) return;

        const { spotCoords } = location.state;

        if (spotCoords) {
            map.flyTo({
                center: [spotCoords.y, spotCoords.x],
                zoom: 16,
                speed: 1.5,
            });
        }
    }, [map, location]);

    const handleSpotClick = (
        spotId: number,
        centerPoint: SpotCoordinatesDto,
        region: string,
        city: string,
    ): void => {
        dispatch(spotDetailsModalAction.setSpotId(spotId));
        dispatch(
            spotWeatherActions.setSpotCoordinates({
                latitude: centerPoint.x,
                longitude: centerPoint.y,
                region,
                city,
            }),
        );
        dispatch(spotDetailsModalAction.handleShowModal());
        dispatch(spotWeatherActions.openBasicWeatherModal());
        dispatch(
            currentViewSpotsListModalActions.closeCurrentViewSpotsListModal(),
        );
        dispatch(searchedSpotListModalAction.handleCloseList());
        mutateAsync(spotId);
    };

    useEffect(() => {
        const longitude = Number(searchParams.get("longitude") ?? undefined);
        const latitude = Number(searchParams.get("latitude") ?? undefined);
        if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
            map?.flyTo({
                center: [longitude, latitude],
                zoom: 15,
                speed: 1.2,
                curve: 1.42,
                essential: true,
            });
        }
    }, []);

    return (
        <>
            {data?.map((spot: GeneralSpot) =>
                shouldRenderMarker(spot.area, zoomLevel) ? (
                    <Marker
                        key={spot.id}
                        longitude={spot.centerPoint.y}
                        latitude={spot.centerPoint.x}
                        onClick={() =>
                            handleSpotClick(
                                spot.id,
                                spot.centerPoint,
                                spot.region,
                                spot.city,
                            )
                        }
                    >
                        <MdLocationPin
                            className="text-spotLocationMarker cursor-pointer text-3xl"
                            key={spot.id}
                        />
                    </Marker>
                ) : (
                    <Source
                        key={spot.id}
                        id={spot.id.toString()}
                        type="geojson"
                        data={createGeoJson(spot)}
                    >
                        <Layer
                            id={spot.id.toString()}
                            type="fill"
                            paint={{
                                "fill-color": spot.areaColor,
                                "fill-opacity": 0.55,
                            }}
                        />
                    </Source>
                ),
            )}
        </>
    );
}
