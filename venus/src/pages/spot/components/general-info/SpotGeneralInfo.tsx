import { Rate } from "antd";
import Tag from "../../../../model/interface/spot/tag/tag";

type SpotGeneralInfoProps = {
  name: string;
  country: string;
  city: string;
  street: string;
  description: string;
  rating: number;
  ratingCount: number;
  tags: Tag[];
};

export default function SpotGeneralInfo({
  name,
  country,
  city,
  street,
  description,
  rating,
  ratingCount,
  tags,
}: SpotGeneralInfoProps) {
  return (
    <div className="mt-5 mb-2 flex-col">
      <div className="flex justify-between">
        <p className="text-lg">{name}</p>
        <div className="mt-1 mr-2 inline-flex text-lg">
          <Rate disabled allowHalf value={rating} />
          <div>{ratingCount}</div>
        </div>
      </div>
      <div className="flex-col space-y-0.5">
        <p>Description:</p>
        <p>{description}</p>
      </div>
    </div>
  );
}
