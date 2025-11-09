import PostFormEditor from "../../posts/components/PostFormEditor";
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
        formState: { errors },
    } = useForm<PostCommentFormFields>({
        resolver: zodResolver(PostCommentFormSchema),
        mode: "onBlur",
        defaultValues: commentToEdit
            ? { content: commentToEdit.content }
            : {
                  content: "",
              },
    });

    const onSubmit: SubmitHandler<PostCommentFormFields> = (data) => {
        handleComment({
            content: data.content,
        });
        onClose();
    };

    return (
        <div className={`mb-4 ${className}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <PostFormEditor<PostCommentFormFields>
                    name="content"
                    control={control}
                    error={errors.content?.message}
                    variant={RichTextEditorVariantType.DEFAULT}
                />

                <FormActionButtons
                    onCancel={onClose}
                    submitLabel={commentToEdit ? "Edit" : "Comment"}
                />
            </form>
        </div>
    );
}
