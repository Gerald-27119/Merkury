import SpotDetailsGallery from "./components/spot-details-gallery/SpotDetailsGallery.js";
import SpotGeneralInfo from "./components/spot-info/SpotGeneralInfo.js";
import { spotDetailsModalAction } from "../../redux/spot-modal";
import { fetchSpotsDataById } from "../../http/spots-data.js";
import { useEffect } from "react";
import { notificationAction } from "../../redux/notification.js";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import useSelectorTyped from "../../hooks/useSelectorTyped";
import { AxiosError } from "axios";
import { HiX } from "react-icons/hi";
import { MdLocationPin } from "react-icons/md";
import SpotAddressInfo from "./components/spot-info/SpotAddressInfo";
import SpotActionButtonsContainer from "./components/buttons/SpotActionButtonsContainer";
import { motion } from "framer-motion";
import SpotCommentsList from "./components/comments/SpotCommentsList";

const slideVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
};

export default function SpotDetails() {
    const spotId = useSelectorTyped((state) => state.spotDetails.spotId);
    const isSidebarOpen = useSelectorTyped((state) => state.sidebar.isOpen);
    const dispatch = useDispatchTyped();

    const { data, error, isLoading } = useQuery({
        queryFn: () => fetchSpotsDataById(spotId),
        queryKey: ["spotDetails", spotId],
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if ((error as AxiosError)?.response?.data) {
            dispatch(
                notificationAction.addError({
                    message: (error as AxiosError)?.response?.data,
                }),
            );
        }
    }, [dispatch, error]);

    const handleClickCloseModal = () => {
        dispatch(spotDetailsModalAction.handleCloseModal());
    };

    return (
        <>
            <div
                className={`absolute top-0 z-[5] h-screen w-screen bg-black/85 transition-opacity duration-300 ${
                    isSidebarOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            ></div>
            <motion.div
                key={spotId}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.3 }}
                className="dark:bg-violetDarker dark:text-darkText absolute top-10 left-0 z-[2] flex h-full w-[20rem] p-2 text-lg xl:top-0 xl:left-17 xl:w-[35rem] xl:text-xl"
            >
                {isLoading && <LoadingSpinner />}
                {data && (
                    <div className="mx-3 flex h-fit w-full flex-col">
                        <div className="mt-3 flex items-center justify-between text-xl">
                            <div className="flex justify-start">
                                <MdLocationPin className="mr-0.5 text-2xl text-red-600" />
                                <SpotAddressInfo
                                    country={data.country}
                                    city={data.city}
                                    street={data.street}
                                />
                            </div>
                            <HiX
                                className="cursor-pointer"
                                onClick={handleClickCloseModal}
                            />
                        </div>
                        <SpotGeneralInfo
                            name={data.name}
                            description={data.description}
                            rating={data.rating}
                            ratingCount={data.ratingCount}
                            tags={data.tags}
                        />
                        <SpotDetailsGallery media={data.media} />
                        <SpotActionButtonsContainer spotId={spotId} />
                        <SpotCommentsList spotId={data.id} />
                    </div>
                )}
            </motion.div>
        </>
    );
}
