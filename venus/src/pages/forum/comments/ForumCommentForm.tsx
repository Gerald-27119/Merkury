import PostFormEditor from "../posts/components/PostFormEditor";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ForumCommentFormFields,
    ForumCommentFormSchema,
} from "../../../model/schema/forumCommentFormSchema";
import ForumCommentDto from "../../../model/interface/forum/postComment/forumCommentDto";
import { RichTextEditorVariantType } from "../../../model/enum/forum/richTextEditorVariantType";
import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";

interface ForumCommentFormProps {
    handleComment: (newComment: ForumCommentDto) => void;
    onClose: () => void;
    commentToEdit?: ForumCommentGeneral;
    className?: string;
}

export default function ForumCommentForm({
    handleComment,
    onClose,
    commentToEdit,
    className,
}: ForumCommentFormProps) {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ForumCommentFormFields>({
        resolver: zodResolver(ForumCommentFormSchema),
        mode: "onBlur",
        defaultValues: commentToEdit
            ? { content: commentToEdit.content }
            : {
                  content: "",
              },
    });

    const onSubmit: SubmitHandler<ForumCommentFormFields> = (data) => {
        let newComment = {
            content: data.content,
        };
        handleComment(newComment);
        onClose();
    };

    return (
        <div className={`mb-4 ${className}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <PostFormEditor<ForumCommentFormFields>
                    name="content"
                    control={control}
                    error={errors.content?.message}
                    variant={RichTextEditorVariantType.DEFAULT}
                />

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight cursor-pointer rounded px-4 py-2 text-white"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
