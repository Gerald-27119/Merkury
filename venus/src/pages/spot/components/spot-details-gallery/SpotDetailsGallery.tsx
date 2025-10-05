import Photo from "./Photo.js";
import { Carousel, ConfigProvider } from "antd";
import SpotMediaDto from "../../../../model/interface/spot/spotMediaDto";
import { MediaType } from "../../../../model/enum/mediaType";
import Video from "./Video";
import { useState } from "react";

type PhotoGalleryProps = {
    media: SpotMediaDto[];
};

export default function SpotDetailsGallery({ media }: PhotoGalleryProps) {
    const [current, setCurrent] = useState<number>(0);

    return (
        <div className="my-10 flex h-full items-center justify-center">
            {media && media.length > 0 ? (
                <ConfigProvider
                    theme={{
                        components: {
                            Carousel: {
                                arrowOffset: -25,
                                dotOffset: -20,
                            },
                        },
                    }}
                >
                    <Carousel
                        arrows={true}
                        className="carousel-rounded 3xl:w-[30rem] w-[15rem] 2xl:w-[25rem]"
                        afterChange={(idx: number) => {
                            setCurrent(idx);
                        }}
                    >
                        {media.map((media: SpotMediaDto, idx: number) =>
                            media.genericMediaType === MediaType.VIDEO ? (
                                <Video
                                    key={media.id}
                                    video={media}
                                    shouldPlayVideo={idx === current}
                                />
                            ) : (
                                <Photo key={media.id} photo={media} />
                            ),
                        )}
                    </Carousel>
                </ConfigProvider>
            ) : (
                <div className="my-1">
                    <p className="text-center text-lg">
                        There are no media for this spot.
                    </p>
                </div>
            )}
        </div>
    );
}
