import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";

interface TiptapProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}

export default function Tiptap({
    placeholder,
    value,
    onChange,
    onBlur,
}: TiptapProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc ml-4",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal ml-4",
                    },
                },
                link: {
                    linkOnPaste: true,
                    autolink: false,
                },
            }),
            Placeholder.configure({
                placeholder: placeholder,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
            FileHandler.configure(),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            let html = editor.getHTML();
            onChange(html);
        },
    });

    return (
        <>
            <div className="flex h-full flex-col">
                <MenuBar editor={editor} />
                <EditorContent
                    editor={editor}
                    onBlur={onBlur}
                    className={
                        "tiptap-editor-content [&_.is-empty:first-child::before]:text-lightText/60 dark:[&_.is-empty:first-child::before]:text-darkText/50 h-full flex-1 overflow-y-auto wrap-break-word [&_.is-empty:first-child::before]:content-[attr(data-placeholder)]"
                    }
                />
            </div>
        </>
    );
}
