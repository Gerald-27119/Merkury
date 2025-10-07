type OptionButtonProps = {
    label: string;
    onClick: () => void;
};

export default function OptionButton({ label, onClick }: OptionButtonProps) {
    return <button onClick={onClick}>{label}</button>;
}
