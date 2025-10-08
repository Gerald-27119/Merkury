import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";

interface PreviewItem {
    id: string;
    file: File;
    url: string;
}

interface UploadButtonProps {
    onFileSelect: (files: File[]) => void;
}

export default function UploadButton({ onFileSelect }: UploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [items, setItems] = useState<PreviewItem[]>([]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const allowed = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
        const valid = Array.from(event.target.files).filter((f) =>
            allowed.includes(f.type),
        );

        if (valid.length === 0) {
            event.target.value = "";
            return;
        }

        const newItems = valid.map((file) => ({
            id: uuid().toString(),
            file,
            url: URL.createObjectURL(file),
        }));

        const updatedItems = [...items, ...newItems];
        setItems(updatedItems);

        onFileSelect(updatedItems.map((i) => i.file));
        event.target.value = "";
    };

    const handleRemoveAt = (id: string) => {
        const itemToRemove = items.find((i) => i.id === id);
        if (itemToRemove) URL.revokeObjectURL(itemToRemove.url);

        const updatedItems = items.filter((i) => i.id !== id);
        setItems(updatedItems);
        onFileSelect(updatedItems.map((i) => i.file));
    };

    useEffect(() => {
        return () => {
            items.forEach((i) => URL.revokeObjectURL(i.url));
        };
    }, [items]);

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
                {items.map(({ id, file, url }) => (
                    <div
                        key={id}
                        className="group relative h-12 w-12 overflow-hidden rounded-md"
                    >
                        {file.type.startsWith("image/") ? (
                            <img
                                src={url}
                                alt={file.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <video
                                src={url}
                                className="h-full w-full bg-gray-200 object-cover"
                                muted
                                playsInline
                            />
                        )}

                        <button
                            type="button"
                            onClick={() => handleRemoveAt(id)}
                            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <FaTrash className="text-xl" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
