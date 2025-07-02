interface ProfileStatsProps {
    value: number | undefined;
    label: string;
    onClick?: () => void;
}

export default function ProfileStat({
    value,
    label,
    onClick,
}: ProfileStatsProps) {
    return (
        <button
            className="flex cursor-pointer flex-col items-center gap-3"
            onClick={onClick}
            type="button"
        >
            <p className="text-darkBorder text-2xl">{label}</p>
            <p className="group-hover:text-shadow-darkText text-4xl">
                {value ?? 0}
            </p>
        </button>
    );
}
