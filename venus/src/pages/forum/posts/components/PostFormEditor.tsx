import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Tiptap from "../../rich-text-editor/Tiptap";

interface PostFormProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    error?: string;
}

export default function PostFormEditor<T extends FieldValues>({
    name,
    control,
    error,
}: PostFormProps<T>) {
    return (
        <div className="w-full">
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <div className="dark:bg-darkBg mx-auto h-60 rounded-lg p-4 shadow-lg">
                            <Tiptap
                                placeholder="Type here..."
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        </div>
                        {error && (
                            <p className="text-xs font-bold text-red-500">
                                {error}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
    );
}
