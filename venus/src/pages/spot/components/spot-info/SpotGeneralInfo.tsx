import { ConfigProvider, Rate } from "antd";
import SpotTag from "../tag/SpotTag";
import TagDto from "../../../../model/interface/tagDto";
import useScreenSize from "../../../../hooks/useScreenSize";
import { useEffect, useState } from "react";
import { calculateRateStarSize } from "../../../../utils/spot-utils";

type SpotGeneralInfoProps = {
    name: string;
    description: string;
    rating: number;
    ratingCount: number;
    tags: TagDto[];
};

export default function SpotGeneralInfo({
    name,
    description,
    rating,
    ratingCount,
    tags,
}: SpotGeneralInfoProps) {
    const { height, width } = useScreenSize();

    const [rateStarSize, setRateStarSize] = useState<number>(
        calculateRateStarSize(width, height),
    );

    useEffect(() => {
        setRateStarSize(calculateRateStarSize(width, height));
    }, [height, width]);

    return (
        <div className="mt-5 mb-2 flex-col space-y-6">
            <div className="flex flex-col items-center space-y-2 xl:flex-row xl:justify-between">
                <p className="text-violetBrightText dark:text-darkText text-2xl">
                    {name}
                </p>
                <div className="flex justify-end space-x-2">
                    <div className="custom-rate mx-2 mt-1 inline-flex min-w-fit">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Rate: {
                                        starBg: "#ffffff",
                                        starColor:
                                            "var(--color-ratingStarColor)",
                                        starSize: rateStarSize,
                                        starHoverScale: "scale(1,1)",
                                    },
                                },
                            }}
                        >
                            <Rate
                                data-testid="spot-rating"
                                disabled
                                allowHalf
                                value={rating}
                            />
                        </ConfigProvider>
                    </div>
                    <p className="text-xl 2xl:text-2xl">({ratingCount})</p>
                </div>
            </div>
            <ul className="flex flex-wrap space-x-4">
                {tags.map((tag) => (
                    <li className="my-1" key={tag.id}>
                        <SpotTag name={tag.name} />
                    </li>
                ))}
            </ul>
            <div className="text-violetDarkText dark:text-darkText flex-col space-y-0.5">
                <p>Description:</p>
                <p>{description}</p>
            </div>
        </div>
    );
}
