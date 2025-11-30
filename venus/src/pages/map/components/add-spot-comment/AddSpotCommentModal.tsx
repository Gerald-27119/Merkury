import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useState } from "react";
import { ConfigProvider, Rate } from "antd";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { addSpotCommentModalInfoActions } from "../../../../redux/add-spot-comment-modal-info";
import { motion } from "framer-motion";
import UploadButton from "../../../account/add-spot/components/UploadButton";
import { notificationAction } from "../../../../redux/notification";
import { addSpotCommentSchema } from "./validation-schema/addSpotCommentSchema";

const slideVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function AddSpotCommentModal() {
    const [spotRating, setSpotRating] = useState<number>(0);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [commentText, setCommentText] = useState<string>("");

    const { spotName } = useSelectorTyped((state) => state.addSpotCommentModal);

    const dispatch = useDispatchTyped();

    const handleCancelAddSpotComment = () => {
        dispatch(addSpotCommentModalInfoActions.closeAddSpotCommentModal());
    };

    const handleFileSelect = (files: File[]) => {
        setMediaFiles(files);
    };

    const handleAddSpotComment = () => {
        if (mediaFiles.length === 0) {
            dispatch(
                notificationAction.addError({
                    message: "Please add at least one media.",
                }),
            );
            return;
        } else if (mediaFiles.length > 20) {
            dispatch(
                notificationAction.addError({
                    message: "Maximum amount of media id 20.",
                }),
            );
            return;
        }
        const validationResult = addSpotCommentSchema.safeParse({
            commentText,
            spotRating,
        });

        if (!validationResult.success) {
            validationResult.error.issues.forEach((i) => {
                dispatch(notificationAction.addError({ message: i.message }));
            });
            return;
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
            className="absolute top-0 z-[4] flex h-full w-full items-center justify-center bg-black/80"
        >
            <div className="bg-darkBgSoft text-darkText flex flex-col items-center space-y-5 rounded-2xl p-8">
                <h1 className="mb-4 text-3xl">{spotName}</h1>
                <ConfigProvider
                    theme={{
                        components: {
                            Rate: {
                                starBg: "#ffffff",
                                starColor: "#fadb14",
                                starSize: 50,
                                starHoverScale: "scale(1,1)",
                            },
                        },
                    }}
                >
                    <Rate
                        allowHalf
                        value={spotRating}
                        onChange={(value) => setSpotRating(value)}
                    />
                </ConfigProvider>
                <div className="bg-darkBg mt-5 flex w-full flex-col items-center rounded-md px-4 py-1.5">
                    <div className="h-96 max-w-56">
                        <UploadButton onFileSelect={handleFileSelect} />
                    </div>
                    <hr className="w-full" />
                    <textarea
                        className="placeholder-darkText h-40 w-full text-sm focus:outline-0"
                        placeholder="Type here..."
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-center space-x-5 text-xl">
                    <button
                        onClick={handleCancelAddSpotComment}
                        className="bg-violetDarker border-violetLightDarker hover:bg-violetLightDarker cursor-pointer rounded-xl border px-3 py-1.5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddSpotComment}
                        className="bg-violetBrighter hover:bg-violetBright cursor-pointer rounded-xl px-3 py-1.5"
                    >
                        Publish
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
