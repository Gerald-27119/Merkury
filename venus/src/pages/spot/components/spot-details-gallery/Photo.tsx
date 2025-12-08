import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";
import { HTMLAttributes, useEffect, useState } from "react";
import SpotMediaDto from "../../../../model/interface/spot/spotMediaDto";
import { useMutation } from "@tanstack/react-query";
import { getExpandedSpotMediaGalleryPagePosition } from "../../../../http/spots-data";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { MediaType } from "../../../../model/enum/mediaType";
import { SpotExpandedGallerySortingType } from "../../../../model/enum/spot/spotExpandedGallerySortingType";
import { expandedSpotMediaGalleryAction } from "../../../../redux/expanded-spot-media-gallery";
import { expandedSpotMediaGalleryModalsActions } from "../../../../redux/expanded-spot-media-gallery-modals";

type PhotoProps = {
    photo: SpotMediaDto;
} & HTMLAttributes<HTMLDivElement>;

export default function Photo({ photo, ...props }: PhotoProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const dispatch = useDispatchTyped();

    const { spotId } = useSelectorTyped((state) => state.spotDetails);
    const { sorting } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );

    const { mutateAsync, data } = useMutation({
        mutationFn: ({
            spotId,
            mediaType,
            sorting,
        }: {
            spotId: number;
            mediaId: number;
            mediaType: MediaType;
            sorting: SpotExpandedGallerySortingType;
        }) =>
            getExpandedSpotMediaGalleryPagePosition(
                spotId,
                photo.id,
                mediaType,
                sorting,
            ),
    });

    const handleClickPhoto = async () => {
        await mutateAsync({
            spotId: spotId!,
            mediaId: photo.id,
            mediaType: MediaType.PHOTO,
            sorting,
        });
    };

    useEffect(() => {
        if (data) {
            dispatch(
                expandedSpotMediaGalleryAction.setExpandedGalleryMediaId({
                    mediaId: photo.id,
                }),
            );
            dispatch(
                expandedSpotMediaGalleryAction.setExpandedGalleryMediaPagePosition(
                    { mediaPagePosition: data.mediaPagePosition },
                ),
            );
            dispatch(
                expandedSpotMediaGalleryAction.setExpandedGalleryMediaType({
                    mediaType: MediaType.PHOTO,
                }),
            );
            dispatch(expandedSpotMediaGalleryModalsActions.openModals());
        }
    }, [data, photo]);

    return (
        <div className="3xl:h-68 flex h-40 items-center justify-center overflow-hidden bg-black xl:h-60">
            {isLoading && <LoadingSpinner />}
            {photo ? (
                <img
                    {...props}
                    src={photo.url}
                    alt={photo.title}
                    onLoad={handleImageLoad}
                    className="max-h-full max-w-full cursor-pointer object-contain"
                    onClick={handleClickPhoto}
                />
            ) : (
                <p>No photo to display</p>
            )}
        </div>
    );
}
