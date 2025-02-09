import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";
import { useState } from "react";

export default function Photo({ photo, onClick = () => {}, ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-fit h-fit" onClick={photo ? onClick : undefined}>
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
