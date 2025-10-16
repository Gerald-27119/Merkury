import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Tiptap from "../../rich-text-editor/Tiptap";
import { RichTextEditorVariantType } from "../../../../model/enum/forum/richTextEditorVariantType";

interface PostFormProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    error?: string;
    variant: RichTextEditorVariantType;
}

const baseClassName = "dark:bg-darkBg mx-auto rounded-lg p-4";
const variantClasses = {
    default: "border-1 border-solid border-black dark:border-white",
    modal: "h-60 shadow-lg",
};

export default function PostFormEditor<T extends FieldValues>({
    name,
    control,
    error,
    variant,
}: PostFormProps<T>) {
    return (
        <div className="w-full">
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <div
                            className={`${baseClassName} ${variantClasses[variant]}`}
                        >
                            <Tiptap
                                placeholder="Type here..."
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                variant={variant}
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
