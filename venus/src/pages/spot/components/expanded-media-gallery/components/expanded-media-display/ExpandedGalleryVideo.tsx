import ReactPlayer from "react-player";

type ExpandedGalleryVideoProps = {
    url: string;
};

export default function ExpandedGalleryVideo({
    url,
}: ExpandedGalleryVideoProps) {
    return (
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
    );
}
