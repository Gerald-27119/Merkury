import { UseFormRegister, Path, FieldValues } from "react-hook-form";

interface PostFormProps<T extends FieldValues> {
    name: Path<T>;
    placeholder: string;
    type: string;
    register: UseFormRegister<T>;
    error?: string;
}

export default function PostFormInput<T extends FieldValues>({
    name,
    placeholder,
    type,
    register,
    error,
}: PostFormProps<T>) {
    return (
        <div>
            <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className="dark:bg-darkBg rounded-lg p-2"
            />
            {error && (
                <p className="text-xs font-bold break-words text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
