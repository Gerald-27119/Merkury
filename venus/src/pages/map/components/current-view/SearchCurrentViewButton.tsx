import { useMap } from "@vis.gl/react-maplibre";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { currentViewSpotParamsActions } from "../../../../redux/current-view-spot-params";
import { currentViewSpotsListModalActions } from "../../../../redux/current-view-spots-list-modal";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useQueryClient } from "@tanstack/react-query";
import { currentViewSpotsActions } from "../../../../redux/current-view-spots";
import { spotDetailsModalAction } from "../../../../redux/spot-modal";
import { spotWeatherActions } from "../../../../redux/spot-weather";

export default function SearchCurrentViewButton() {
    const { current: map } = useMap();

    const { swLng, swLat, neLng, neLat, name, sorting, ratingFrom } =
        useSelectorTyped((state) => state.currentViewSpotsParams);

    const dispatch = useDispatchTyped();

    const queryClient = useQueryClient();

    const handleClickSearchCurrentView = () => {
        const viewBounds = map?.getBounds();
        dispatch(
            currentViewSpotParamsActions.setParams({
                swLng: viewBounds?._sw.lng,
                swLat: viewBounds?._sw.lat,
                neLng: viewBounds?._ne.lng,
                neLat: viewBounds?._ne.lat,
            }),
        );
        dispatch(currentViewSpotsActions.clearCurrentViewSpots());
        queryClient.removeQueries({
            queryKey: [
                "current-view-spots",
                swLng,
                swLat,
                neLng,
                neLat,
                name,
                sorting,
                ratingFrom,
            ],
        });
        dispatch(
            currentViewSpotsListModalActions.openCurrentViewSpotsListModal(),
        );
        dispatch(spotDetailsModalAction.handleCloseModal());
        dispatch(spotWeatherActions.closeAllWeatherModals());
    };

    return (
        <button
            className="dark:bg-violetLight bg-fifth hover:bg-whiteSmoke text-violetBrightText dark:text-darkText hover:dark:bg-violetLighter absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-3xl px-14 py-1.5 text-xl font-semibold drop-shadow-md dark:drop-shadow-none"
            onClick={handleClickSearchCurrentView}
        >
            Search this area
        </button>
    );
}
