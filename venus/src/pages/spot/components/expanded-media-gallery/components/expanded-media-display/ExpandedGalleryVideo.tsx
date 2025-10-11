type ExpandedGalleryVideoProps = {
    url: string;
};

export default function ExpandedGalleryVideo({
    url,
}: ExpandedGalleryVideoProps) {
    return <div>{url}</div>;
}
