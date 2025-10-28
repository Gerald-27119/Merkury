import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useState } from "react";
import UploadButton from "../../../account/add-spot/components/UploadButton";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../../redux/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMediaToSpot } from "../../../../http/user-dashboard";
import { IoClose } from "react-icons/io5";
import { addSpotMediaModalActions } from "../../../../redux/add-spot-media-modal";
import { motion } from "framer-motion";

const slideVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function SpotAddMediaModal() {
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const { spotId } = useSelectorTyped((state) => state.spotDetails);
    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationKey: ["addSpotMedia", spotId],
        mutationFn: addMediaToSpot,
        onSuccess: async () => {
            dispatch(
                notificationAction.addSuccess({
                    message: "Media added successfully.",
                }),
            );
            await queryClient.invalidateQueries({
                queryKey: ["spotDetails", spotId],
            });
            setMediaFiles([]);
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Failed to add media to the spot.",
                }),
            );
        },
    });

    const handleFileSelect = (files: File[]) => {
        setMediaFiles(files);
    };

    const handleSubmit = async () => {
        if (mediaFiles.length === 0) {
            dispatch(
                notificationAction.addError({
                    message: "Please add at least one media.",
                }),
            );
            return;
        }

        const fd = new FormData();
        for (const file of mediaFiles) {
            fd.append("mediaFiles", file);
        }

        await mutateAsync({ formData: fd, spotId: spotId! });
    };

    const handleCloseModal = () => {
        dispatch(addSpotMediaModalActions.closeAddSpotMediaModal());
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
            className="absolute top-0 z-[4] flex h-full w-full flex-col items-center bg-black"
        >
            <IoClose
                onClick={handleCloseModal}
                className="text-darkText mt-2 ml-auto cursor-pointer text-2xl"
            />
            <div className="bg-darkBgSoft my-auto flex flex-col items-center rounded-2xl p-10">
                <UploadButton onFileSelect={handleFileSelect} />
                <div className="text-darkText mt-10 flex space-x-3 text-xl">
                    <button
                        onClick={handleCloseModal}
                        className="hover:bg-darkBgMuted cursor-pointer rounded-xl px-2.5 py-1"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="hover:bg-darkBgMuted cursor-pointer rounded-xl px-2.5 py-1"
                    >
                        {isPending ? "Uploading…" : "Submit"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
