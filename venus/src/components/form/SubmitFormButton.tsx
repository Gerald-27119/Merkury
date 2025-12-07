interface SubmitFormButtonProps {
    id: string;
    label: string;
    fields: string[];
    didEdit: Record<string, boolean>;
    isValid: Record<string, { value: boolean }>;
}

export default function SubmitFormButton({
    id,
    label,
    fields,
    didEdit,
    isValid,
}: SubmitFormButtonProps) {
    const isDisabled = !fields.every((f) => didEdit[f] && isValid[f]?.value);

    return (
        <button
            id={id}
            type="submit"
            className="dark:bg-violetDark bg-violetLight/80 not-disabled:hover:bg-violetLight text-darkText not-disabled:dark:hover:bg-violetDarker mt-3 w-full rounded-lg p-3 font-semibold capitalize shadow-md shadow-violet-900/20 transition-all duration-300 not-disabled:cursor-pointer dark:shadow-black/50"
            disabled={isDisabled}
        >
            {label}
        </button>
    );
}
