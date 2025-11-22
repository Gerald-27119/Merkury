import { IconType } from "react-icons";

interface SearchFieldInputProps {
    label?: string;
    inputType: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Icon?: IconType;
}

export default function SearchFieldInput({
    label,
    inputType,
    value,
    onChange,
    Icon,
}: SearchFieldInputProps) {
    return (
        <div className="relative">
            {label && <p className="mb-1">{label}</p>}
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                className="dark:bg-darkBg bg-lightBgSoft w-full rounded-lg p-1 shadow-lg outline-none"
            />
            {Icon && (
                <button type="button" className="absolute top-[60%] right-2">
                    <Icon />
                </button>
            )}
        </div>
    );
}
