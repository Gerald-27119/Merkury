import { ConfigProvider, Rate } from "antd";
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { spotDetailsModalAction } from "../../../redux/spot-modal";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import HomePageSpotDto from "../../../model/interface/spot/search-spot/homePageSpotDto";
import { useQuery } from "@tanstack/react-query";
import { getBasicSpotWeather } from "../../../http/weather";
import { TbTemperatureCelsius } from "react-icons/tb";
import WeatherIcon from "../../map/components/weather/components/WeatherIcon";

interface SpotTileProps {
    spot: HomePageSpotDto;
}

export default function SpotTile({ spot }: SpotTileProps) {
    const navigate = useNavigate();
    const dispatch = useDispatchTyped();

    const { data } = useQuery({
        queryKey: ["weather", spot.centerPoint.x, spot.centerPoint.y],
        queryFn: () =>
            getBasicSpotWeather(spot.centerPoint.x, spot.centerPoint.y),
    });

    let formattedDistance: string;

    if (spot.distanceToUser === null) {
        formattedDistance = "Distance unavailable";
    } else if (spot.distanceToUser < 1) {
        formattedDistance = `${(spot.distanceToUser * 1000).toFixed(1)} m from you`;
    } else {
        formattedDistance = `${spot.distanceToUser.toFixed(1)} km from you`;
    }

    const handleSeeOnMap = () => {
        navigate("/map", {
            state: {
                spotCoords: spot.centerPoint,
            },
        });
    };

    const handleDetailsClick = (): void => {
        navigate("/map", {
            state: {
                spotCoords: spot.centerPoint,
            },
        });

        dispatch(spotDetailsModalAction.setSpotId(spot.id));
        dispatch(spotDetailsModalAction.handleShowModal());
    };

    return (
        <li className="flex w-70 flex-col overflow-hidden rounded-md shadow-lg sm:w-96 md:w-1/2 xl:w-full">
            <img
                src={spot.firstPhoto}
                alt="spotPhoto"
                className="aspect-video rounded-t-md object-cover"
            />
            <div className="dark:bg-darkBgMuted bg-lightBgMuted flex flex-col space-y-2 rounded-b-md px-4 py-3">
                <div className="flex items-center justify-between">
                    <span className="flex items-center justify-end space-x-1">
                        <FaLocationDot className="text-spotLocationMarker text-lg" />
                        <p className="text-xl">{spot.city}</p>
                    </span>
                    <div className="dark:bg-violetLight bg-violetLighter flex items-center space-x-2 rounded-full px-3 py-1 shadow-md shadow-black/30">
                        <WeatherIcon
                            isDay={data?.current?.["is_day"] ?? 0}
                            code={data?.current?.["weather_code"] ?? 0}
                            textSize="text-2xl"
                        />
                        <span className="flex items-center gap-x-0.5">
                            <p>{data?.current?.["temperature_2m"]}</p>
                            <TbTemperatureCelsius className="text-xl" />
                        </span>
                    </div>
                </div>
                <h1 className="text-2xl font-semibold">{spot.name}</h1>
                <div className="flex items-center gap-x-2">
                    <ConfigProvider
                        theme={{
                            components: {
                                Rate: {
                                    starBg: "#aaaaab",
                                },
                            },
                        }}
                    >
                        <Rate
                            allowHalf
                            value={spot.rating}
                            disabled
                            data-testid={`spot-rating-${spot.id}`}
                        />
                    </ConfigProvider>
                    <p>({spot.ratingCount})</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                    {spot.tags.map((tag) => (
                        <li
                            key={tag.id}
                            className="dark:bg-darkBgSoft bg-lightBgSoft dark:shadow-darkBgSoft/60 rounded-md px-3.5 py-1 text-center capitalize shadow-md"
                        >
                            {tag.name}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleDetailsClick}
                        className="dark:bg-violetDark dark:hover:bg-violetDarker bg-violetLight hover:bg-violetLight/80 flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 text-lg shadow-md shadow-black/30"
                    >
                        <FiInfo className="text-2xl" />
                        <p>Details</p>
                    </button>
                    <button
                        onClick={handleSeeOnMap}
                        className="dark:bg-violetLight dark:hover:bg-violetLight/80 bg-violetLighter hover:bg-violetLighter/80 flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 shadow-md shadow-black/30"
                    >
                        <FaMapLocationDot className="text-xl" />
                        <span className="flex flex-col items-start">
                            <p>See on map</p>
                            <p className="text-sm dark:text-violet-300">
                                {formattedDistance}
                            </p>
                        </span>
                    </button>
                </div>
            </div>
        </li>
    );
}
