import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { RichTextEditorVariantType } from "../../../model/enum/forum/richTextEditorVariantType";
import { forumAllowedMimeTypes } from "../../../model/interface/forum/forumAllowedMimeTypes";

interface TiptapProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    variant: RichTextEditorVariantType;
    onFileError?: (msg: string) => void;
    onFileSuccess?: () => void;
}

export default function Tiptap({
    placeholder,
    value,
    onChange,
    onBlur,
    variant = RichTextEditorVariantType.DEFAULT,
    onFileError,
    onFileSuccess,
}: TiptapProps) {
    const isAllowedFile = (file: File) => {
        return forumAllowedMimeTypes.includes(file.type);
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {},
                orderedList: {},
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
            FileHandler.configure({
                onDrop: (currentEditor, files, pos) => {
                    files.forEach((file) => {
                        if (!isAllowedFile(file)) {
                            onFileError?.(
                                "File type not allowed. Only PNG, JPEG, GIF, WEBP are supported.",
                            );
                            return;
                        }
                        onFileSuccess?.();

                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            currentEditor
                                .chain()
                                .insertContentAt(pos, {
                                    type: "image",
                                    attrs: {
                                        src: fileReader.result,
                                        alt: "image",
                                    },
                                })
                                .focus()
                                .run();
                        };
                    });
                },
                onPaste: (currentEditor, files, htmlContent) => {
                    if (htmlContent) return false;
                    files.forEach((file) => {
                        if (!isAllowedFile(file)) {
                            onFileError?.(
                                "File type not allowed. Only PNG, JPEG, GIF, WEBP are supported.",
                            );
                            return;
                        }
                        onFileSuccess?.();

                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            currentEditor
                                .chain()
                                .insertContentAt(
                                    currentEditor.state.selection.anchor,
                                    {
                                        type: "image",
                                        attrs: {
                                            src: fileReader.result,
                                            alt: "image",
                                        },
                                    },
                                )
                                .focus()
                                .run();
                        };
                    });
                },
            }),
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
        "tiptap-editor-content cursor-text [&_.is-empty:first-child::before]:text-lightText/60 dark:[&_.is-empty:first-child::before]:text-darkText/50 overflow-y-auto wrap-break-word [&_.is-empty:first-child::before]:content-[attr(data-placeholder)]";

    const contentVariants = {
        default: "resize-y min-h-30 max-h-300",
        modal: "h-full",
    };

    return (
        <>
            <div className={`${wrapperVariants[variant]}`}>
                <MenuBar
                    editor={editor}
                    onFileError={onFileError}
                    onFileSuccess={onFileSuccess}
                />
                <EditorContent
                    editor={editor}
                    onBlur={onBlur}
                    onClick={() => editor?.commands.focus()}
                    className={`${baseContentClassName} ${contentVariants[variant]}`}
                />
            </div>
        </>
    );
}
