import { useState } from "react";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";

type ExpandedGalleryPhotoProps = {
    url: string;
};

export default function ExpandedGalleryPhoto({
    url,
}: ExpandedGalleryPhotoProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="3xl:h-[60rem] 3xl:w-[90rem] flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-900 xl:h-[30rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[80rem]">
            {isLoading && <LoadingSpinner />}
            {url ? (
                <img
                    src={url}
                    alt={url}
                    onLoad={handleImageLoad}
                    className="max-h-full max-w-full rounded-2xl object-contain"
                />
            ) : (
                <p>No photo to display</p>
            )}
        </div>
    );
}
