import { Editor, useEditorState } from "@tiptap/react";
import { EditorMenuOptions } from "../../../utils/tiptap/EditorMenuOptions";
import HeadingDropdown from "./HeadingDropdown";

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

    return (
        <div className="mb-1 flex w-full flex-wrap space-x-2">
            <HeadingDropdown editor={editor} size={18} />
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={option.onClick}
                    className={`dark:hover:bg-darkBgMuted hover:bg-lightBgDarker cursor-pointer rounded p-1 ${
                        option.pressed ? "bg-violet-600" : ""
                    }`}
                    type="button"
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
}
