interface FormActionButtonsProps {
    onCancel: () => void;
    submitLabel: string;
    cancelLabel?: string;
}

export default function FormActionButtons({
    onCancel,
    submitLabel,
    cancelLabel = "Cancel",
}: FormActionButtonsProps) {
    return (
        <div className="mt-4 flex justify-end gap-2">
            <button
                onClick={onCancel}
                className="cursor-pointer rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                className="dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight cursor-pointer rounded px-4 py-2 text-white"
            >
                {submitLabel}
            </button>
        </div>
    );
}
