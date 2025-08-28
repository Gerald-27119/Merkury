import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Button from "../../../../components/buttons/Button";
import { ButtonVariantType } from "../../../../model/enum/buttonVariantType";
import { FaX } from "react-icons/fa6";
import PolygonDrawer from "./PolygonDrawer";
import UploadButton from "./UploadButton";
import SpotCoordinatesDto from "../../../../model/interface/spot/coordinates/spotCoordinatesDto";
import { SpotToAddDto } from "../../../../model/interface/account/add-spot/spotToAddDto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addSpot, fetchCoordinates } from "../../../../http/user-dashboard";
import { useEffect, useState } from "react";
import AddSpotInput from "./AddSpotInput";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../../redux/notification";
import useDebounce from "../../../../hooks/useDebounce";

type ConfigTyp = { name: keyof SpotToAddDto; type: string; id: string }[];

const basicInfoInputConfig: ConfigTyp = [
    { name: "name", type: "text", id: "name" },
    { name: "description", type: "text", id: "description" },
];

const addressInputConfig: ConfigTyp = [
    { name: "country", type: "text", id: "country" },
    { name: "region", type: "text", id: "region" },
    { name: "city", type: "text", id: "city" },
    { name: "street", type: "text", id: "street" },
];

interface AddSpotModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export default function AddSpotModal({ onClose, isOpen }: AddSpotModalProps) {
    const dispatch = useDispatchTyped();

    const [spot, setSpot] = useState<SpotToAddDto>({
        id: 0,
        name: "",
        description: "",
        country: "",
        region: "",
        city: "",
        street: "",
        borderPoints: [],
        media: [],
    });

    const debouncedStreet = useDebounce(spot.street, 500);
    const debouncedCity = useDebounce(spot.city, 500);
    const debouncedRegion = useDebounce(spot.region, 500);
    const debouncedCountry = useDebounce(spot.country, 500);

    const fullAddress = `${debouncedStreet}, ${debouncedCity}, ${debouncedRegion}, ${debouncedCountry}`;

    const { data, isLoading } = useQuery({
        queryKey: ["geocode", fullAddress],
        queryFn: () => fetchCoordinates(fullAddress),
        enabled:
            debouncedStreet.length >= 2 &&
            debouncedCity.length >= 2 &&
            debouncedRegion.length >= 2 &&
            debouncedCountry.length >= 2,
        staleTime: 5 * 60 * 1000,
    });

    const { mutateAsync } = useMutation({
        mutationFn: addSpot,
        onSuccess: () => {
            onClose();
        },
        onError: () => {
            dispatch(
                notificationAction.setError({
                    message: "Error when trying to add spot",
                }),
            );
        },
    });

    const modalRoot = document.getElementById("modal");

    const handleSetSpot = <K extends keyof SpotToAddDto>(
        key: K,
        value: SpotToAddDto[K],
    ) => {
        setSpot((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleAddSpot = async () => {
        await mutateAsync(spot);
    };

    const [mapPosition, setMapPosition] = useState({
        latitude: 54.352553,
        longitude: 18.64745,
    });

    useEffect(() => {
        if (data) {
            setMapPosition({ latitude: data.y, longitude: data.x });
        }
    }, [data]);

    if (!modalRoot) {
        return null;
    }

    return createPortal(
        <AnimatePresence initial={false}>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-60 bg-black/70"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    ></motion.div>
                    <motion.div
                        className="dark:bg-darkBgSoft dark:text-darkText bg-lightBgSoft text-lightText fixed top-1/2 left-1/2 z-61 h-11/12 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md p-8 shadow-md"
                        onClick={(event) => event.stopPropagation()}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col space-y-10">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-semibold">
                                    Add spot
                                </h1>
                                <button
                                    className="cursor-pointer"
                                    onClick={onClose}
                                >
                                    <FaX className="text-2xl" />
                                </button>
                            </div>
                            <div className="flex">
                                <div className="flex w-1/3 flex-col items-center space-y-6 pr-5">
                                    <div className="w-full space-y-6">
                                        <h1 className="text-center text-xl">
                                            Basic Information
                                        </h1>
                                        <AddSpotInput
                                            config={basicInfoInputConfig}
                                            spot={spot}
                                            onChange={handleSetSpot}
                                        />
                                    </div>
                                    <div className="w-full space-y-2">
                                        <h1 className="text-start text-lg">
                                            Address
                                        </h1>
                                        <AddSpotInput
                                            config={addressInputConfig}
                                            spot={spot}
                                            onChange={handleSetSpot}
                                        />
                                    </div>
                                    <UploadButton
                                        onFileSelect={(files) =>
                                            handleSetSpot("media", files)
                                        }
                                    />
                                </div>
                                <div className="relative flex w-full">
                                    <PolygonDrawer
                                        initialPosition={mapPosition}
                                        onPolygonComplete={(coords) => {
                                            const mappedCoords: SpotCoordinatesDto[] =
                                                coords[0].map(([lng, lat]) => ({
                                                    x: lat,
                                                    y: lng,
                                                }));
                                            handleSetSpot(
                                                "borderPoints",
                                                mappedCoords,
                                            );
                                        }}
                                    />
                                    {isLoading && (
                                        <div className="absolute inset-0 z-70 flex items-center justify-center rounded-md bg-black/40">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <form method="dialog" className="mt-3 flex space-x-3">
                            <Button
                                variant={ButtonVariantType.MODAL}
                                onClick={onClose}
                                className="text-darkText bg-red-600 hover:bg-red-700"
                            >
                                close
                            </Button>
                            <Button
                                variant={ButtonVariantType.MODAL}
                                onClick={handleAddSpot}
                                className="bg-violetDark text-darkText hover:bg-violetDark/80"
                            >
                                add spot
                            </Button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        modalRoot,
    );
}
