import { Editor, useEditorState } from "@tiptap/react";
import { EditorMenuOptions } from "../../../utils/tiptap/EditorMenuOptions";
import HeadingDropdown from "./HeadingDropdown";
import LinkFormButton from "./LinkFormButton";
import { LuLink, LuImage } from "react-icons/lu";
import EditorIconButton from "./EditorIconButton";

interface MenuBarProps {
    editor: Editor | null;
}

export default function MenuBar({ editor }: MenuBarProps) {
    if (!editor) {
        return null;
    }

    const state = useEditorState({
        editor,
        selector: (snapshot) => ({
            isBulletList: snapshot.editor.isActive("bulletList"),
            isOrderedList: snapshot.editor.isActive("orderedList"),
            isBold: snapshot.editor.isActive("bold"),
            isItalic: snapshot.editor.isActive("italic"),
            isUnderlined: snapshot.editor.isActive("underline"),
            isLeft: snapshot.editor.isActive({ textAlign: "left" }),
            isCenter: snapshot.editor.isActive({ textAlign: "center" }),
            isRight: snapshot.editor.isActive({ textAlign: "right" }),
            isJustify: snapshot.editor.isActive({ textAlign: "justify" }),
        }),
    });

    const options = EditorMenuOptions(editor, state, 18);
    const handleLinkSubmission = (href: string) => {
        if (href) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href })
                .run();
        }
    };
    const handleImageLinkSubmission = (href: string) => {
        if (href) {
            editor.chain().focus().setImage({ src: href, alt: "image" }).run();
        }
    };

    return (
        <div className="mb-1 flex w-full flex-wrap space-x-2">
            {options.slice(0, 2).map((option) => (
                <EditorIconButton
                    key={option.id}
                    icon={option.icon}
                    onClick={option.onClick}
                    pressed={option.pressed}
                />
            ))}
            <HeadingDropdown editor={editor} size={18} />

            {options.slice(2).map((option, index) => (
                <EditorIconButton
                    key={option.id}
                    icon={option.icon}
                    onClick={option.onClick}
                    pressed={option.pressed}
                />
            ))}

            <LinkFormButton
                placeholder="https://url.com"
                icon={LuLink}
                size={18}
                onSubmit={handleLinkSubmission}
            />

            <LinkFormButton
                placeholder="image.jpg"
                icon={LuImage}
                size={18}
                onSubmit={handleImageLinkSubmission}
            />
        </div>
    );
}
