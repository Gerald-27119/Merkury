import ControlledEditor from "../../posts/components/ControlledEditor";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    PostCommentFormFields,
    PostCommentFormSchema,
} from "../../../../model/zod-schemas/postCommentFormSchema";
import PostCommentDto from "../../../../model/interface/forum/postComment/postCommentDto";
import { RichTextEditorVariantType } from "../../../../model/enum/forum/richTextEditorVariantType";
import PostCommentGeneral from "../../../../model/interface/forum/postComment/postCommentGeneral";
import FormActionButtons from "../../components/FormActionButtons";
import { uploadToAzure } from "../../../../http/forum-file-upload";
import { extractAndUploadImages } from "../../../../utils/forum/extractAndUploadImages";

interface ForumCommentFormProps {
    handleComment: (newComment: PostCommentDto) => void;
    onClose: () => void;
    commentToEdit?: PostCommentGeneral;
    className?: string;
}

export default function PostCommentForm({
    handleComment,
    onClose,
    commentToEdit,
    className,
}: ForumCommentFormProps) {
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
    } = useForm<PostCommentFormFields>({
        resolver: zodResolver(PostCommentFormSchema),
        mode: "onBlur",
        defaultValues: commentToEdit
            ? { content: commentToEdit.content }
            : {
                  content: "",
              },
    });

    const onSubmit: SubmitHandler<PostCommentFormFields> = async (data) => {
        try {
            const finalContent = await extractAndUploadImages(
                data.content,
                (file) => uploadToAzure(file),
            );

            handleComment({
                content: finalContent,
            });

            onClose();
        } catch {
            setError("content", {
                type: "manual",
                message:
                    "One of the images couldn't be uploaded, please try again.",
            });
            return;
        }
    };

    return (
        <div className={`mb-4 ${className}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ControlledEditor<PostCommentFormFields>
                    name="content"
                    control={control}
                    error={errors.content?.message}
                    variant={RichTextEditorVariantType.DEFAULT}
                    setError={setError}
                    clearErrors={clearErrors}
                />

                <FormActionButtons
                    onCancel={onClose}
                    submitLabel={commentToEdit ? "Edit" : "Comment"}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
}
