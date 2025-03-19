import { Carousel } from "antd";
import { useState } from "react";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner.jsx";

export default function SpotPhotoCarousel({ photos }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };
  return (
    <Carousel
      arrows={true}
      infinite={false}
      className="w-[30rem] h-80 my-10 px-10"
    >
      {isLoading && <LoadingSpinner />}
      {photos.map((photo, index) => (
        <div key={index}>
          <img
            src={photo.img}
            alt={photo.title}
            onLoad={handleImageLoad}
            className="w-[30rem] h-72"
          />
        </div>
      ))}
    </Carousel>
  );
}
