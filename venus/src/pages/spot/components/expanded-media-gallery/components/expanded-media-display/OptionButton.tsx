type OptionButtonProps = {
    label: string;
    onClick: () => void;
    isSelected: boolean;
};

export default function OptionButton({
    label,
    onClick,
    isSelected,
}: OptionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`${isSelected ? "dark:bg-violetLightDarker bg-warmerWhiteSmoke" : "dark:bg-violetDarker bg-lightBorder"} dark:ring-violetLight hover:bg-warmerWhiteSmoke dark:hover:bg-violetLightDarker cursor-pointer rounded-2xl px-2 py-1 text-lg ring-1`}
        >
            {label}
        </button>
    );
}
