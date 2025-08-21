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
import { useState } from "react";
import AddSpotInput from "./AddSpotInput";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import useDebounce from "../../../../hooks/useDebounce";

const basicInfoInputConfig = [
    { name: "name", type: "text", id: "name" },
    { name: "description", type: "text", id: "description" },
];

const addressInputConfig = [
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

    const fullAddress = `${spot.street}, ${spot.city}, ${spot.region}, ${spot.country}`;

    const [debouncedAddress] = useDebounce(fullAddress, 500);

    const { data, isLoading } = useQuery({
        queryKey: ["geocode", debouncedAddress],
        queryFn: () => fetchCoordinates(debouncedAddress),
        enabled: !!spot.street && !!spot.city,
        staleTime: 5 * 60 * 1000,
    });

    const { mutateAsync } = useMutation({
        mutationFn: addSpot,
        onSuccess: () => {
            close();
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

    if (!modalRoot) {
        return null;
    }

    if (isLoading) {
        return <LoadingSpinner />;
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
                                <PolygonDrawer
                                    initialPosition={
                                        data ?? {
                                            latitude: 54.352553,
                                            longitude: 18.64745,
                                        }
                                    }
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
