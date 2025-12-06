import { TfiMenuAlt } from "react-icons/tfi";

interface ExpansionButtonProps {
    label: string;
    onClick: () => void;
}

export default function ExpansionButton({
    label,
    onClick,
}: ExpansionButtonProps) {
    return (
        <div
            onClick={onClick}
            className="dark:hover:text-lightBgSoft flex cursor-pointer items-center gap-2"
        >
            <TfiMenuAlt className="inline-block align-middle" />
            <p className="inline-block align-middle">{label}</p>
        </div>
    );
}
