import { useMap } from "@vis.gl/react-maplibre";

export default function SearchCurrentViewButton() {
    const { current: map } = useMap();

    const handleClickSearchCurrentView = () => {
        console.log(map?.getBounds());
    };

    return (
        <button
            className="dark:bg-violetLight dark:text-darkText hover:dark:bg-violetLighter absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-3xl px-14 py-1.5 text-xl font-semibold"
            onClick={handleClickSearchCurrentView}
        >
            Search current view
        </button>
    );
}
