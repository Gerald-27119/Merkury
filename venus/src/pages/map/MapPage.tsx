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
    const handleZoomEnd = (event: any) => {
        dispatch(mapAction.setZoomLevel(event.target.getZoom()));
    };

    const showSpotDetailsModal = useSelectorTyped(
        (state) => state.spotDetails.showModal,
    );

    const showSearchedSpotsList = useSelectorTyped(
        (state) => state.searchedSpotsListModal.showList,
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
            <AnimatePresence>
                {showSpotDetailsModal && <SpotDetails key="spot-details" />}
                {showSearchedSpotsList && (
                    <SearchedSpotsList key="searched-spots-list" />
                )}
            </AnimatePresence>
            <div className="absolute right-1 bottom-1 flex flex-col items-center space-y-2 sm:right-2 sm:bottom-2 xl:right-5 xl:bottom-5">
                <UserLocationPanel />
                <ZoomControlPanel />
            </div>
            <Spots />
        </Map>
    );
}
