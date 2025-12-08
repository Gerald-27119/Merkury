interface FormActionButtonsProps {
    onCancel: () => void;
    submitLabel: string;
    cancelLabel?: string;
    isSubmitting?: boolean;
}

export default function FormActionButtons({
    onCancel,
    submitLabel,
    cancelLabel = "Cancel",
    isSubmitting = false,
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
                className={`dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"} rounded px-4 py-2 text-white`}
            >
                {isSubmitting ? "Submitting..." : submitLabel}
            </button>
        </div>
    );
}
