import Photo from "./Photo.js";
import Img from "../../../../model/interface/img";
import { Carousel, ConfigProvider } from "antd";

type PhotoGalleryProps = {
    photos: Img[];
};

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
    return (
        <div className="my-10 flex h-full items-center justify-center">
            {photos && photos.length > 0 ? (
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
                        className="max-w-[15rem] xl:max-w-[30rem]"
                    >
                        {photos.map((photo) => (
                            <Photo key={photo.id} photo={photo} />
                        ))}
                    </Carousel>
                </ConfigProvider>
            ) : (
                <div className="my-1 rounded-xs border border-orange-500">
                    <p className="text-center text-lg">
                        There are no photos for this spot.
                    </p>
                </div>
            )}
        </div>
    );
}
