import { Rate } from "antd";
import SpotTagDto from "../../../../model/interface/spot/tag/spotTagDto";
import SpotTag from "../tag/SpotTag";

type SpotGeneralInfoProps = {
    name: string;
    description: string;
    rating: number;
    ratingCount: number;
    tags: SpotTagDto[];
};

export default function SpotGeneralInfo({
    name,
    description,
    rating,
    ratingCount,
    tags,
}: SpotGeneralInfoProps) {
    return (
        <div className="mt-5 mb-2 flex-col space-y-6">
            <div className="flex flex-col items-center space-y-2 xl:flex-row xl:justify-between">
                <p className="text-2xl">{name}</p>
                <div className="flex justify-end space-x-2">
                    <div className="custom-rate text-ratingStarColor mx-2 mt-1 inline-flex min-w-fit">
                        <Rate
                            data-testid="spot-rating"
                            disabled
                            allowHalf
                            value={rating}
                        />
                    </div>
                    <p className="text-2xl">({ratingCount})</p>
                </div>
            </div>
            <ul className="flex flex-wrap space-x-4">
                {tags.map((tag) => (
                    <li className="my-1" key={tag.id}>
                        <SpotTag name={tag.name} />
                    </li>
                ))}
            </ul>
            <div className="flex-col space-y-0.5">
                <p>Description:</p>
                <p>{description}</p>
            </div>
        </div>
    );
}
