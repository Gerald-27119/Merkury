import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { RichTextEditorVariantType } from "../../../model/enum/forum/richTextEditorVariantType";

interface TiptapProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    variant: RichTextEditorVariantType;
}

export default function Tiptap({
    placeholder,
    value,
    onChange,
    onBlur,
    variant = RichTextEditorVariantType.DEFAULT,
}: TiptapProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
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

    const wrapperVariants = {
        default: "flex flex-col",
        modal: "flex flex-col h-full",
    };

    const baseContentClassName =
        "tiptap-editor-content [&_.is-empty:first-child::before]:text-lightText/60 dark:[&_.is-empty:first-child::before]:text-darkText/50 overflow-y-auto wrap-break-word [&_.is-empty:first-child::before]:content-[attr(data-placeholder)]";

    const contentVariants = {
        default: "resize-y  min-h-30 max-h-300",
        modal: "h-full flex-1",
    };

    return (
        <>
            <div className={`${wrapperVariants[variant]}`}>
                <MenuBar editor={editor} />
                <EditorContent
                    editor={editor}
                    onBlur={onBlur}
                    className={`${baseContentClassName} ${contentVariants[variant]}`}
                />
            </div>
        </>
    );
}
