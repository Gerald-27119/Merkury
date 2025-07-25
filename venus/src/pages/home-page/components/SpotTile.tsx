import SearchSpotDto from "../../../model/interface/spot/search-spot/searchSpotDto";
import { ConfigProvider, Rate } from "antd";
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { MdOutlineWbSunny } from "react-icons/md";
import { FiInfo } from "react-icons/fi";

interface SpotTileProps {
    spot: SearchSpotDto;
}

export default function SpotTile({ spot }: SpotTileProps) {
    return (
        <li className="flex w-[670px] flex-col">
            <img
                src={spot.firstPhoto}
                alt="spotPhoto"
                className="aspect-video rounded-t-md"
            />
            <div className="bg-darkBgMuted flex flex-col space-y-2 rounded-b-md px-4 py-3">
                <div className="flex justify-between">
                    <span className="flex items-center justify-end space-x-1">
                        <FaLocationDot className="text-spotLocationMarker text-lg" />
                        <p className="text-xl">Gdańsk</p>
                    </span>
                    <div className="bg-violetLight flex items-center space-x-2 rounded-full px-3 py-1 shadow-md shadow-black/30">
                        <MdOutlineWbSunny />
                        <p>10 *C</p>
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
                <ul className="flex space-x-2">
                    {spot.tags.map((tag) => (
                        <li
                            key={tag.id}
                            className="bg-darkBgSoft shadow-darkBgSoft/60 rounded-md px-3.5 py-1 text-center capitalize shadow-md"
                        >
                            {tag.name}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end space-x-2">
                    <button className="bg-violetDark hover:bg-violetDarker flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 text-lg shadow-md shadow-black/30">
                        <FiInfo className="text-2xl" />
                        <p>Details</p>
                    </button>
                    <button className="bg-violetLight hover:bg-violetLight/80 flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 shadow-md shadow-black/30">
                        <FaMapLocationDot className="text-xl" />
                        <span className="flex flex-col items-start">
                            <p>See on map</p>
                            <p className="text-sm text-violet-300">
                                500m from you
                            </p>
                        </span>
                    </button>
                </div>
            </div>
        </li>
    );
}
