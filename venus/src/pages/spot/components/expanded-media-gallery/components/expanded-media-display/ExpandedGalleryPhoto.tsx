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
        <div className="h-fit">
            {isLoading && <LoadingSpinner />}
            {url ? (
                <img
                    src={url}
                    alt={url}
                    onLoad={handleImageLoad}
                    className="h-[60rem] w-[90rem] rounded-2xl"
                />
            ) : (
                <p>No photo to display</p>
            )}
        </div>
    );
}
