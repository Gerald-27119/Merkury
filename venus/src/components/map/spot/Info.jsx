import { calculateStars } from "../../../utils/spot-utils.jsx";

export default function Info({ name, description, rating }) {
  return (
    <div className="flex-col mb-2">
      <div className="flex justify-between">
        <div className="text-lg">{name}</div>
        <div className="inline-flex text-lg mr-2 mt-1">
          {calculateStars(rating)}
        </div>
      </div>
      <div className="flex-col space-y-0.5">
        <div>Description:</div>
        <div>{description}</div>
      </div>
    </div>
  );
}
