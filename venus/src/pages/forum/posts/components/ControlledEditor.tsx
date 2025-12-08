import {
    Control,
    Controller,
    FieldValues,
    Path,
    UseFormClearErrors,
    UseFormSetError,
} from "react-hook-form";
import Tiptap from "../../rich-text-editor/Tiptap";
import { RichTextEditorVariantType } from "../../../../model/enum/forum/richTextEditorVariantType";

interface ControlledEditorProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    error?: string;
    variant: RichTextEditorVariantType;
    setError: UseFormSetError<T>;
    clearErrors: UseFormClearErrors<T>;
}

const baseClassName = "dark:bg-darkBg bg-lightBgSoft mx-auto rounded-lg p-4";
const variantClasses = {
    default: "border-1 border-solid border-black dark:border-white",
    modal: "h-60 shadow-lg",
};

export default function ControlledEditor<T extends FieldValues>({
    name,
    control,
    error,
    variant,
    setError,
    clearErrors,
}: ControlledEditorProps<T>) {
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
                                onFileError={(msg: string) => {
                                    setError(name, {
                                        type: "manual",
                                        message: msg,
                                    });
                                }}
                                onFileSuccess={() => clearErrors(name)}
                            />
                        </div>
                        {error && (
                            <p className="mt-1 text-xs font-bold text-red-500">
                                {error}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
    );
}
