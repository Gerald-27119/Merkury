import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";
import { HTMLAttributes, useState } from "react";
import SpotMediaDto from "../../../../model/interface/spot/spotMediaDto";

type PhotoProps = {
    photo: SpotMediaDto;
} & HTMLAttributes<HTMLDivElement>;

export default function Photo({ photo, ...props }: PhotoProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="h-fit">
            {isLoading && <LoadingSpinner />}
            {photo ? (
                <img
                    {...props}
                    src={photo.url}
                    alt={photo.title}
                    onLoad={handleImageLoad}
                    className="3xl:h-68 h-40 xl:h-60"
                />
            ) : (
                <p>No photo to display</p>
            )}
        </div>
    );
}
