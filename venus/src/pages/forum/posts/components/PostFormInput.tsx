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
                className="dark:bg-darkBg bg-lightBgSoft dark:placeholder-darkText/50 placeholder-lightText/60 mt-4 w-full rounded-lg p-2 shadow-lg outline-none"
            />
            {error && (
                <p className="mt-1 text-xs font-bold break-words text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
