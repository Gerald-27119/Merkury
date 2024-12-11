import { calculateStars } from "../../../utils/spot-utils.jsx";

export default function Info({ name, description, rating }) {
  return (
    <div className="flex-col mb-2 mt-5">
      <div className="flex justify-between">
        <p className="text-lg">{name}</p>
        <div className="inline-flex text-lg mr-2 mt-1">
          {calculateStars(rating)}
        </div>
      </div>
      <div className="flex-col space-y-0.5">
        <p>Description:</p>
        <p>{description}</p>
      </div>
    </div>
  );
}
