import { useQuery } from "@tanstack/react-query";
import { get18MostPopularSpots } from "../../http/spots-data";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import MostPopularSpot from "./components/MostPopularSpot";

export default function HomePage() {
    const { data } = useQuery({
        queryKey: ["mostPopular"],
        queryFn: get18MostPopularSpots,
    });

    return (
        <div className="dark:bg-darkBg dark:text-darkText flex min-h-screen w-full flex-col items-center p-8">
            <div className="flex flex-col space-y-4">
                <h1 className="text-center text-3xl">The Most Popular Spots</h1>
                <div className="flex items-center">
                    <button className="hover:text-darkBorder cursor-pointer transition-all duration-300">
                        <RiArrowLeftWideFill className="text-7xl" />
                    </button>
                    <div className="grid grid-cols-3 grid-rows-2 gap-4">
                        {data?.slice(0, 6).map((spot) => (
                            <MostPopularSpot spot={spot} key={spot.id} />
                        ))}
                    </div>
                    <button className="hover:text-darkBorder cursor-pointer transition-all duration-300">
                        <RiArrowRightWideFill className="text-7xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}
