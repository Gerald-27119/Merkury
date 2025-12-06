import React, { useRef } from "react";
import { Editor } from "@tiptap/react";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { forumMediaAction } from "../../../redux/forumMedia";

interface FileUploadButtonProps {
    editor: Editor | null;
    icon: React.ElementType;
    size: number;
}

const allowedMimeTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];

export default function FileUploadButton({
    editor,
    icon: Icon,
    size,
}: FileUploadButtonProps) {
    const dispatch = useDispatchTyped();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editor) return;
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (!allowedMimeTypes.includes(file.type)) {
                return;
            }

            const id = crypto.randomUUID();
            const reader = new FileReader();

            reader.onload = () => {
                editor
                    .chain()
                    .focus()
                    .setImage({ src: reader.result as string, alt: id })
                    .run();

                dispatch(forumMediaAction.addImage({ id, file }));
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
                accept={allowedMimeTypes.join(",")}
                className="hidden"
                multiple
            />
        </>
    );
}
