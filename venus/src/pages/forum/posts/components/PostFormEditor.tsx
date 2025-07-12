import { Editor } from "@tinymce/tinymce-react";
import { tinymceForumConfig } from "../../../../utils/tinymce/tinymceForumConfig";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";

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
    const editorRef = useRef<TinyMCEEditor | null>(null);
    return (
        <div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <Editor
                            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                            onInit={(_, editor) => {
                                editorRef.current = editor;
                            }}
                            value={field.value}
                            onEditorChange={(newContent) => {
                                field.onChange(newContent);
                            }}
                            onBlur={field.onBlur}
                            init={tinymceForumConfig}
                        />
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
