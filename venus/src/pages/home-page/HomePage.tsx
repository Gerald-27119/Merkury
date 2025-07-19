import { useQuery } from "@tanstack/react-query";
import { get18MostPopularSpots } from "../../http/spots-data";
import Carousel from "./components/Carousel";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";

export default function HomePage() {
    const { data, isLoading } = useQuery({
        queryKey: ["mostPopular"],
        queryFn: get18MostPopularSpots,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="dark:bg-darkBg dark:text-darkText flex min-h-screen w-full flex-col items-center overflow-hidden p-8">
            {/*Todo wyszukiwarka i guzik do przelaczania miedzy simple i advance filters i wyswietlanie wyszukanych spotow */}
            <div className="flex w-full flex-col items-center space-y-4">
                <h1 className="text-center text-3xl">The Most Popular Spots</h1>
                <Carousel spots={data!} spotsPerPage={6} />
            </div>
        </div>
    );
}
