import { useBoolean } from "../../../hooks/useBoolean";
import { useClickOutside } from "../../../hooks/useClickOutside";
import React, { useEffect, useRef, useState } from "react";
interface LinkFormProps {
    placeholder: string;
    icon: React.ElementType;
    size: number;
    onSubmit: (href: string) => void;
}

export default function LinkFormButton({
    placeholder,
    icon: Icon,
    size,
    onSubmit,
}: LinkFormProps) {
    const [isFormShown, showForm, hideForm] = useBoolean(false);
    const [link, setLink] = useState("");
    const formRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useClickOutside(formRef, hideForm, isFormShown);

    useEffect(() => {
        if (isFormShown) {
            inputRef.current?.focus();
        }
    }, [isFormShown]);

    const handleSubmit = () => {
        if (link.trim()) {
            onSubmit(link.trim());
            hideForm();
            setLink("");
        }
    };

    return (
        <div ref={formRef}>
            <button
                type="button"
                onClick={isFormShown ? hideForm : showForm}
                className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker cursor-pointer rounded p-1"
            >
                <Icon size={size} />
            </button>
            {isFormShown && (
                <div className="dark:bg-darkBgSoft bg-lightBgSoft absolute z-60 mt-1 flex items-center rounded p-2 shadow-lg ring-2">
                    <input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        type="text"
                        placeholder={placeholder}
                        className="outline-none"
                        ref={inputRef}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    ></input>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight ml-1 cursor-pointer rounded p-1"
                    >
                        ok
                    </button>
                </div>
            )}
        </div>
    );
}
