import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";
import { HTMLAttributes, useState } from "react";
import Img from "../../../../model/interface/img";

type PhotoProps = {
    photo: Img;
} & HTMLAttributes<HTMLDivElement>;

export default function Photo({ photo, ...props }: PhotoProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="max-h-60">
            {isLoading && <LoadingSpinner />}
            {photo ? (
                <img
                    {...props}
                    src={photo.img}
                    alt={photo.title}
                    onLoad={handleImageLoad}
                />
            ) : (
                <p>No photo to display</p>
            )}
        </div>
    );
}
