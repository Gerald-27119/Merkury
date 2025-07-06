import Photo from "./Photo.js";
import { Carousel, ConfigProvider } from "antd";
import SpotMediaDto from "../../../../model/interface/spot/spotMediaDto";
import { MediaType } from "../../../../model/enum/mediaType";

type PhotoGalleryProps = {
    media: SpotMediaDto[];
};

export default function PhotoGallery({ media }: PhotoGalleryProps) {
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
                        className="carousel-rounded max-w-[15rem] xl:max-w-[30rem]"
                    >
                        {media.map((media) =>
                            media.mediaType === MediaType.VIDEO ? (
                                <p>video</p>
                            ) : (
                                <Photo key={media.id} photo={media} />
                            ),
                        )}
                    </Carousel>
                </ConfigProvider>
            ) : (
                <div className="my-1 rounded-xs border border-orange-500">
                    <p className="text-center text-lg">
                        There are no media for this spot.
                    </p>
                </div>
            )}
        </div>
    );
}
