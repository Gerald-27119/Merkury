import React from "react";

interface EditorIconButtonProps {
    icon: React.ReactNode;
    pressed?: boolean;
    onClick: () => void;
}

export default function EditorIconButton({
    icon,
    pressed,
    onClick,
}: EditorIconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`dark:hover:bg-darkBgMuted hover:bg-lightBgDarker cursor-pointer rounded p-1 ${
                pressed ? "bg-violet-600" : ""
            }`}
            type="button"
        >
            {icon}
        </button>
    );
}
