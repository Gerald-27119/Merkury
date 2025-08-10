import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "./MenuBar";

interface TiptapProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export default function Tiptap({ placeholder, value, onChange }: TiptapProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            Placeholder.configure({
                placeholder: placeholder,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight.configure({ multicolor: true }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
            FileHandler.configure(),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    return (
        <>
            <div className="flex h-full flex-col">
                <MenuBar editor={editor} />
                <EditorContent
                    editor={editor}
                    className={
                        "tiptap-editor-content [&_.is-empty:first-child::before]:text-lightText/60 dark:[&_.is-empty:first-child::before]:text-darkText/50 flex-1 overflow-y-auto outline-none [&_.is-empty:first-child::before]:content-[attr(data-placeholder)]"
                    }
                />
            </div>
        </>
    );
}
