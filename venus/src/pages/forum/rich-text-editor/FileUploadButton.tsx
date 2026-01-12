import React, { useRef } from "react";
import { Editor } from "@tiptap/react";
import { forumAllowedMimeTypes } from "../../../model/interface/forum/forumAllowedMimeTypes";

interface FileUploadButtonProps {
    editor: Editor | null;
    icon: React.ElementType;
    size: number;
    onFileError?: (msg: string) => void;
    onFileSuccess?: () => void;
}

export default function FileUploadButton({
    editor,
    icon: Icon,
    size,
    onFileError,
    onFileSuccess,
}: FileUploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editor) return;
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (!forumAllowedMimeTypes.includes(file.type)) {
                onFileError?.(
                    "File type not allowed. Only PNG, JPEG, GIF, WEBP are supported.",
                );
                return;
            }

            onFileSuccess?.();

            const reader = new FileReader();
            reader.onload = () => {
                editor
                    .chain()
                    .focus()
                    .setImage({ src: reader.result as string, alt: "image" })
                    .run();
            };

            reader.readAsDataURL(file);
        });

        e.target.value = "";
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker cursor-pointer rounded p-1"
            >
                <Icon size={size} />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={forumAllowedMimeTypes.join(",")}
                className="hidden"
                multiple
            />
        </>
    );
}
