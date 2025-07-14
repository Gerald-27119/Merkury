interface DisableInputProps {
    label: string;
    value: string | undefined;
    type: string;
    id: string;
    onEdit: () => void;
}

export default function DisableInput({
    label,
    id,
    value,
    type,
    onEdit,
}: DisableInputProps) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label htmlFor="password" className="text-xl font-semibold">
                {label}
            </label>
            <div className="dark:bg-darkBgMuted bg-lightBgMuted flex w-96 items-center justify-between rounded-md px-2.5 py-2 shadow-md dark:shadow-black/50">
                <input id={id} type={type} disabled value={value} />
                <button
                    className="text-violetLight cursor-pointer font-semibold"
                    onClick={onEdit}
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
