import { Map } from "@vis.gl/react-maplibre";
import ZoomControlPanel from "./components/zoom-control/ZoomControlPanel";
import UserLocationPanel from "./components/locations/UserLocationPanel";
import Spots from "./components/spots/Spots";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { mapAction } from "../../redux/map";
import useSelectorTyped from "../../hooks/useSelectorTyped";
import SpotDetails from "../spot/SpotDetails";
import { AnimatePresence } from "framer-motion";
import SpotsNameSearchBar from "./components/spot-search/SpotsNameSearchBar";
import SearchedSpotsList from "../spot/components/searched-spot/SearchedSpotsList";
import SearchCurrentViewButton from "./components/current-view/SearchCurrentViewButton";
import CurrentViewSpotsList from "../spot/components/current-view-spots/CurrentViewSpotsList";
import BasicSpotWeather from "./components/weather/BasicSpotWeather";
import DetailedSpotWeather from "../spot/components/weather/DetailedSpotWeather";
import ExpandedSpotMediaGallery from "../spot/components/expanded-media-gallery/ExpandedSpotMediaGallery";
import FullscreenMediaModal from "./components/spot-gallery/FullscreenMediaModal";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { spotDetailsModalAction } from "../../redux/spot-modal";
import SpotAddMediaModal from "./components/spot-add-media/SpotAddMediaModal";
import { spotWeatherActions } from "../../redux/spot-weather";

type Position = {
    longitude: number;
    latitude: number;
};

const defaultPosition: Position = {
    longitude: 18.64745,
    latitude: 54.352553,
};
export default function MapPage() {
    const dispatch = useDispatchTyped();
    const [searchParams] = useSearchParams();
    const handleZoomEnd = (event: any) => {
        dispatch(mapAction.setZoomLevel(event.target.getZoom()));
    };

    const { isLogged } = useSelectorTyped((state) => state.account);

    useEffect(() => {
        const spotId = Number(searchParams.get("spotId"));
        const longitude = Number(searchParams.get("longitude"));
        const latitude = Number(searchParams.get("latitude"));
        const region = searchParams.get("region");
        const city = searchParams.get("city");
        if (
            Number.isInteger(spotId) &&
            Number.isFinite(longitude) &&
            Number.isFinite(latitude) &&
            region &&
            region.trim().length > 0 &&
            city &&
            city.trim().length > 0
        ) {
            dispatch(spotDetailsModalAction.setSpotId(spotId));
            dispatch(
                spotWeatherActions.setSpotCoordinates({
                    latitude,
                    longitude,
                    region,
                    city,
                }),
            );
            dispatch(spotDetailsModalAction.handleShowModal());
            dispatch(spotWeatherActions.openBasicWeatherModal());
        }
    }, []);

    const showSpotDetailsModal = useSelectorTyped(
        (state) => state.spotDetails.showModal,
    );

    const showBasicSpotWeatherModal = useSelectorTyped(
        (state) => state.spotWeather.showBasicWeather,
    );

    const showSearchedSpotsList = useSelectorTyped(
        (state) => state.searchedSpotsListModal.showList,
    );

    const showCurrentViewSpotsList = useSelectorTyped(
        (state) => state.currentViewSpotsListModal.showList,
    );

    const showDetailedSpotWeatherModal = useSelectorTyped(
        (state) => state.spotWeather.showDetailedWeather,
    );

    const { showExpandedGallery } = useSelectorTyped(
        (state) => state.expandedSpotMediaGalleryModals,
    );

    const { isFullscreenSize } = useSelectorTyped(
        (state) => state.expandedSpotMediaGalleryFullscreenSizeModal,
    );

    const { showAddMediaModal } = useSelectorTyped(
        (state) => state.spotAddMediaModal,
    );

    return (
        <Map
            initialViewState={{
                ...defaultPosition,
                zoom: 15,
            }}
            dragRotate={false}
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
            mapStyle="/map_style1.json"
            attributionControl={false}
            onZoomEnd={handleZoomEnd}
        >
            <SpotsNameSearchBar />
            {showBasicSpotWeatherModal && <BasicSpotWeather />}
            <AnimatePresence>
                {showSpotDetailsModal && <SpotDetails key="spot-details" />}
                {showSearchedSpotsList && (
                    <SearchedSpotsList key="searched-spots-list" />
                )}
                {showCurrentViewSpotsList && (
                    <CurrentViewSpotsList key="current-view-spots-list" />
                )}
                {showDetailedSpotWeatherModal && (
                    <DetailedSpotWeather key="detailed-spot-weather-modal" />
                )}
                {showExpandedGallery && (
                    <ExpandedSpotMediaGallery key="expanded-spot-media-gallery" />
                )}
                {isFullscreenSize && (
                    <FullscreenMediaModal key="expanded-spot-media-gallery-fullscreen-media-modal" />
                )}
                {isLogged && showAddMediaModal && (
                    <SpotAddMediaModal key="spot-add-media-modal" />
                )}
            </AnimatePresence>
            <div className="absolute right-1 bottom-1 flex flex-col items-center space-y-2 sm:right-2 sm:bottom-2 xl:right-5 xl:bottom-5">
                <UserLocationPanel />
                <ZoomControlPanel />
            </div>
            <SearchCurrentViewButton />
            <Spots />
        </Map>
    );
}
