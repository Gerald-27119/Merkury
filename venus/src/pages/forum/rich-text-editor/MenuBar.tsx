import { Editor, useEditorState } from "@tiptap/react";
import { EditorMenuOptions } from "../../../utils/tiptap/EditorMenuOptions";

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
            isHeading1: snapshot.editor.isActive("heading", { level: 1 }),
            isHeading2: snapshot.editor.isActive("heading", { level: 2 }),
            isHeading3: snapshot.editor.isActive("heading", { level: 3 }),
            isBold: snapshot.editor.isActive("bold"),
            isItalic: snapshot.editor.isActive("italic"),
            isUnderlined: snapshot.editor.isActive("underline"),
            isLeft: snapshot.editor.isActive({ textAlign: "left" }),
            isCenter: snapshot.editor.isActive({ textAlign: "center" }),
            isRight: snapshot.editor.isActive({ textAlign: "right" }),
            isJustify: snapshot.editor.isActive({ textAlign: "justify" }),
            isHighlighted: snapshot.editor.isActive("highlight"),
        }),
    });

    const options = EditorMenuOptions(editor, state);

    return (
        <div className="mb-1 w-full space-x-2 text-lg">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={option.onClick}
                    className={`rounded p-1 hover:cursor-pointer ${
                        option.pressed ? "bg-violet-500" : "bg-inherit"
                    }`}
                    type="button"
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
}
