import { motion } from "framer-motion";
import { useBoolean } from "../../../hooks/useBoolean";
import { ChangeEvent } from "react";

interface SearchInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

export default function SearchInput({
    id,
    label,
    value,
    onChange,
    onBlur,
}: SearchInputProps) {
    const [isFocused, setFocusedToTrue, setFocusedToFalse] = useBoolean(false);

    const shouldFloat = isFocused || Boolean(value);

    const handleOnBlur = () => {
        setFocusedToFalse();
        onBlur();
    };

    return (
        <div className="relative w-full">
            <motion.label
                htmlFor={id}
                initial={false}
                animate={{
                    top: shouldFloat ? "-0.7rem" : "0.3rem",
                    left: "0.75rem",
                    fontSize: shouldFloat ? "0.75rem" : "1rem",
                    opacity: shouldFloat ? 1 : 0.6,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="pointer-events-none absolute z-10 px-1 capitalize"
            >
                {label}
            </motion.label>
            <input
                id={id}
                value={value}
                type="text"
                onChange={onChange}
                onFocus={setFocusedToTrue}
                onBlur={handleOnBlur}
                className="dark:border-l-darkBorder w-full border-l p-2 px-1 py-1 focus:outline-none"
            />
        </div>
    );
}
