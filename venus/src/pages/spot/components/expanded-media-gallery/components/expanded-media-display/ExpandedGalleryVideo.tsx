import ReactPlayer from "react-player";

type ExpandedGalleryVideoProps = {
    url: string;
};

export default function ExpandedGalleryVideo({
    url,
}: ExpandedGalleryVideoProps) {
    return (
        <div className="3xl:h-[60rem] 3xl:w-[90rem] overflow-hidden rounded-2xl xl:h-[30rem] xl:w-[55rem] 2xl:h-[50rem] 2xl:w-[80rem]">
            <ReactPlayer
                controls={true}
                src={url}
                style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "16/9",
                }}
                slot="media"
            />
        </div>
    );
}
