import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";

interface UploadButtonProps {
    onFileSelect: (files: File[]) => void;
}

export default function UploadButton({ onFileSelect }: UploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewFiles, setPreviewFiles] = useState<File[]>([]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const allowed = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
        const valid = Array.from(event.target.files).filter((f) =>
            allowed.includes(f.type),
        );

        setPreviewFiles(valid);
        onFileSelect(valid);
    };

    useEffect(() => {
        return () => {
            previewFiles.forEach((file) => URL.revokeObjectURL(file as any));
        };
    }, [previewFiles]);

    return (
        <div className="w-full">
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
            <div className="mt-2 flex flex-wrap gap-2">
                {previewFiles.map((file, index) => {
                    if (file.type.startsWith("image/")) {
                        return (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="h-12 w-12 rounded-md object-cover"
                            />
                        );
                    }
                    return (
                        <video
                            key={index}
                            src={URL.createObjectURL(file)}
                            className="h-12 w-12 rounded-md bg-gray-200 object-cover"
                        />
                    );
                })}
            </div>
        </div>
    );
}
