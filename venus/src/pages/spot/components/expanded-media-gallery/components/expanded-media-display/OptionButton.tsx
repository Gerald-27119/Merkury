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
    return <button onClick={onClick}>{label}</button>;
}
