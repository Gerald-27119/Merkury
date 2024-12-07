import { useState } from "react";

export default function Photo({ photo }) {
  const [expandPhoto, setExpandPhoto] = useState(false);

  const handleExpandPhoto = () => {
    setExpandPhoto(true);
  };

  const handleMinimizePhoto = () => {
    setExpandPhoto(false);
  };

  return (
    <>
      {!expandPhoto && (
        <div onClick={handleExpandPhoto}>
          <img className="h-40 w-80" src={photo.img} alt={photo.title} />
        </div>
      )}
      {expandPhoto && (
        <div className="h-screen w-screen bg-gray-950 bg-transparent">
          <img src={photo.img} alt={photo.title} />
        </div>
      )}
    </>
  );
}
