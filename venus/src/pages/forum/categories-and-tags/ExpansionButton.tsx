import { TfiMenuAlt } from "react-icons/tfi";

interface ExpansionButtonProps {
    label: string;
}

export default function ExpansionButton({ label }: ExpansionButtonProps) {
    return (
        <div className="dark:hover:text-lightBgSoft flex cursor-pointer items-center gap-2">
            <TfiMenuAlt className="inline-block align-middle" />
            <p className="inline-block align-middle">{label}</p>
        </div>
    );
}
