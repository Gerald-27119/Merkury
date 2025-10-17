import MediaInfoDisplay from "./MediaInfoDisplay";
import { MediaType } from "../../../../../../model/enum/mediaType";
import ExpandedGalleryPhoto from "./ExpandedGalleryPhoto";
import ExpandedGalleryVideo from "./ExpandedGalleryVideo";
import ExpandedGalleryPanel from "./ExpandedGalleryPanel";
import useSelectorTyped from "../../../../../../hooks/useSelectorTyped";
import MediaDisplayFilterPanel from "./MediaDisplayFilterPanel";
import { useQuery } from "@tanstack/react-query";
import { getSpotGalleryFullscreenMedia } from "../../../../../../http/spots-data";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import { useEffect } from "react";
import useDispatchTyped from "../../../../../../hooks/useDispatchTyped";
import { expandedSpotGalleryCurrentMediaActions } from "../../../../../../redux/expanded-spot-gallery-current-media";

export default function ExpandedMediaDisplay() {
    const { mediaType, mediaId } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );
    const { spotId } = useSelectorTyped((state) => state.spotDetails);

    const { showExpandedGallery } = useSelectorTyped(
        (state) => state.expandedSpotMediaGalleryModals,
    );

    const {
        data: currentMedia,
        isSuccess,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["expanded-media-display", mediaType, mediaId, spotId],
        queryFn: () =>
            getSpotGalleryFullscreenMedia(spotId!, mediaId, mediaType),
        enabled: !!spotId && !!mediaId && !!mediaType && showExpandedGallery,
    });

    const dispatch = useDispatchTyped();

    useEffect(() => {
        if (isSuccess && currentMedia) {
            dispatch(
                expandedSpotGalleryCurrentMediaActions.setCurrentMedia({
                    mediaType: currentMedia.mediaType,
                    url: currentMedia.url,
                }),
            );
        }
    }, [isSuccess, currentMedia]);
    return (
        <div className="flex flex-col items-center">
            {isLoading && <LoadingSpinner />}
            {isSuccess && currentMedia && (
                <>
                    <MediaInfoDisplay
                        authorName={currentMedia.authorName}
                        authorProfilePhotoUrl={
                            currentMedia.authorProfilePhotoUrl
                        }
                        publishDate={currentMedia.publishDate}
                    />
                    <div className="relative">
                        <div className="absolute top-0 left-1/2">
                            <MediaDisplayFilterPanel />
                        </div>
                        {currentMedia.mediaType === MediaType.PHOTO ? (
                            <ExpandedGalleryPhoto url={currentMedia.url} />
                        ) : (
                            <ExpandedGalleryVideo url={currentMedia.url} />
                        )}
                    </div>
                    <div className="grid w-full grid-cols-3">
                        <span className="justify-self-start">
                            totalMediaCount
                        </span>
                        <ExpandedGalleryPanel
                            url={currentMedia.url}
                            likes={currentMedia.likesNumber}
                        />
                        <div></div>
                    </div>
                </>
            )}
            {isError && <p>Failed to fetch media.</p>}
        </div>
    );
}
