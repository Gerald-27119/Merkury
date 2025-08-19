import { ChangeEvent, useRef } from "react";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";

export default function UploadButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
        ];
        const validFiles = Array.from(files).filter((file) =>
            allowedTypes.includes(file.type),
        );

        if (validFiles.length === 0) return;

        const formData = new FormData();
        validFiles.forEach((file) => formData.append("files", file));
        console.log(validFiles);
    };

    return (
        <>
            <button
                className="dark:bg-darkBgMuted bg-lightBgMuted dark:text-darkText text-lightText dark:hover:bg-darkBgMuted/80 hover:bg-lightBgMuted/70 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md p-2 text-base shadow-md dark:shadow-black/50"
                onClick={handleButtonClick}
            >
                <MdOutlinePhotoSizeSelectActual />
                <p>Upload Media</p>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                multiple
                accept="image/*, video/mp4"
            />
        </>
    );
}
