import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { RichTextEditorVariantType } from "../../../model/enum/forum/richTextEditorVariantType";
import { forumMediaAction } from "../../../redux/forumMedia";
import useDispatchTyped from "../../../hooks/useDispatchTyped";

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
    const dispatch = useDispatchTyped();

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
                allowBase64: false,
            }),
            FileHandler.configure({
                allowedMimeTypes: [
                    "image/png",
                    "image/jpeg",
                    "image/gif",
                    "image/webp",
                ],
                onDrop: (currentEditor, files, pos) => {
                    files.forEach((file) => {
                        const id = crypto.randomUUID();
                        dispatch(forumMediaAction.addImage({ id, file }));

                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            currentEditor
                                .chain()
                                .insertContentAt(pos, {
                                    type: "image",
                                    attrs: {
                                        src: fileReader.result,
                                        alt: id,
                                    },
                                })
                                .focus()
                                .run();
                        };
                    });
                },
                onPaste: (currentEditor, files, htmlContent) => {
                    files.forEach((file) => {
                        if (htmlContent) {
                            return false;
                        }

                        const id = crypto.randomUUID();
                        dispatch(forumMediaAction.addImage({ id, file }));

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
                                            alt: id,
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
                <MenuBar editor={editor} />
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
