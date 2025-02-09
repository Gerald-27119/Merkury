import { Rate } from "antd";

export default function SpotGeneralInfo({ name, description, rating }) {
  return (
    <div className="flex-col mb-2 mt-5">
      <div className="flex justify-between">
        <p className="text-lg">{name}</p>
        <div className="inline-flex text-lg mr-2 mt-1">
          <Rate disabled allowHalf defaultValue={rating} />
        </div>
      </div>
      <div className="flex-col space-y-0.5">
        <p>Description:</p>
        <p>{description}</p>
      </div>
    </div>
  );
}
