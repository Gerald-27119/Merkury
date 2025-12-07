type SelectHeightButtonProps = {
    name: string;
    onClick: () => void;
    selected: boolean;
};

export default function SelectHeightButton({
    name,
    onClick,
    selected,
}: SelectHeightButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`hover:bg-lightBgMuted dark:hover:bg-violetBrighter w-28 cursor-pointer rounded-md px-4 py-1.5 text-xl shadow-md ${selected ? "bg-lightBgMuted dark:bg-violetBrighter" : "bg-warmerWhiteSmoke dark:bg-violetLightDark"}`}
        >
            {name}
        </button>
    );
}
