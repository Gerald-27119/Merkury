import { HiOutlineArrowsExpand } from "react-icons/hi";
import { BiDownload } from "react-icons/bi";
import { GoHeart, GoHeartFill } from "react-icons/go";
import useDispatchTyped from "../../../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryFullscreenSizeActions } from "../../../../../../redux/expanded-spot-media-gallery-fullscreen-size";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    checkIsSpotMediaLikedByUser,
    editSpotMediaLikes,
    increaseSpotMediaViewCount,
} from "../../../../../../http/user-dashboard";
import useSelectorTyped from "../../../../../../hooks/useSelectorTyped";
import { notificationAction } from "../../../../../../redux/notification";
import { useEffect, useState } from "react";

type ExpandedGalleryPanel = {
    url: string;
    likes: number;
    spotMediaId: number;
};

export default function ExpandedGalleryPanel({
    url,
    likes,
    spotMediaId,
}: ExpandedGalleryPanel) {
    const [likesCount, setLikesCount] = useState<number>(likes);
    const [isSpotMediaLikedByUser, setIsSpotMediaLikedByUser] =
        useState<boolean>(false);

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const { isLogged } = useSelectorTyped((state) => state.account);
    const { mediaType, mediaId } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );
    const { spotId } = useSelectorTyped((state) => state.spotDetails);

    const handleSetMediaFullscreen = () => {
        dispatch(expandedSpotMediaGalleryFullscreenSizeActions.setFullScreen());
    };

    const { mutateAsync } = useMutation({
        mutationKey: ["edit-spot-media-likes", spotMediaId],
        mutationFn: editSpotMediaLikes,
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Failed to edit spot media likes.",
                }),
            );
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["is-spot-media-liked-by-user", spotMediaId],
            });
            await queryClient.invalidateQueries({
                queryKey: [
                    "expanded-media-display",
                    mediaType,
                    mediaId,
                    spotId,
                ],
            });
        },
    });

    const { mutateAsync: mutateAsyncIncreaseSpotMediaViewsCount } = useMutation(
        {
            mutationKey: ["increase-spot-media-views-count", spotMediaId],
            mutationFn: increaseSpotMediaViewCount,
            onError: () => {},
        },
    );

    useEffect(() => {
        mutateAsyncIncreaseSpotMediaViewsCount(spotMediaId);
    }, []);

    const { data, isSuccess } = useQuery({
        queryKey: ["is-spot-media-liked-by-user", spotMediaId],
        queryFn: () => checkIsSpotMediaLikedByUser(spotMediaId),
        enabled: isLogged,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setIsSpotMediaLikedByUser(data.isSpotMediaLiked);
        }
    }, [isSuccess, data]);

    const handleClickEditSpotMediaLikes = async () => {
        if (!isLogged) {
            dispatch(
                notificationAction.addInfo({
                    message: "Please sign in to like media.",
                }),
            );
        } else {
            if (isSpotMediaLikedByUser) {
                setLikesCount((prevState) => prevState - 1);
                setIsSpotMediaLikedByUser(false);
            } else {
                setLikesCount((prevState) => prevState + 1);
                setIsSpotMediaLikedByUser(true);
            }
            await mutateAsync(spotMediaId);
        }
    };

    return (
        <div className="flex w-fit items-center justify-center justify-self-center text-2xl">
            <div className="bg-grayBg/15 hover:bg-grayBg/20 cursor-pointer rounded-bl-2xl py-2 pr-2.5 pl-3.5">
                <HiOutlineArrowsExpand onClick={handleSetMediaFullscreen} />
            </div>
            <a
                href={url}
                className="bg-grayBg/15 hover:bg-grayBg/20 m-0 cursor-pointer px-3 py-2"
            >
                <BiDownload />
            </a>
            <div
                onClick={handleClickEditSpotMediaLikes}
                className="hover:bg-grayBg/20 bg-grayBg/15 flex cursor-pointer items-center space-x-1 rounded-br-2xl py-1 pr-2.5 pl-1.5"
            >
                {isLogged && isSpotMediaLikedByUser ? (
                    <GoHeartFill />
                ) : (
                    <GoHeart />
                )}
                <span>{likesCount}</span>
            </div>
        </div>
    );
}
