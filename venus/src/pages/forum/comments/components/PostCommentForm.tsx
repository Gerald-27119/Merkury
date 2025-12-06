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
import { replaceLocalImagesWithUploadedUrls } from "../../../../utils/forum/replaceLocalImagesWithUploadedUrls";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { forumMediaAction } from "../../../../redux/forumMedia";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";

interface ForumCommentFormProps {
    handleComment: (newComment: PostCommentDto) => void;
    onClose: () => void;
    commentToEdit?: PostCommentGeneral;
    className?: string;
    isReply?: boolean;
}

export default function PostCommentForm({
    handleComment,
    onClose,
    commentToEdit,
    className,
    isReply,
}: ForumCommentFormProps) {
    const localImages = useSelector(
        (state: RootState) => state.forumMedia.forms.comment.images,
    );
    const dispatch = useDispatchTyped();

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

    const onSubmit: SubmitHandler<PostCommentFormFields> = async (data) => {
        const finalContent = await replaceLocalImagesWithUploadedUrls(
            data.content,
            localImages,
            (file) => uploadToAzure(file, "forum"),
        );

        handleComment({
            content: finalContent,
        });

        dispatch(forumMediaAction.clearImages(isReply ? "reply" : "comment"));
        onClose();
    };

    return (
        <div className={`mb-4 ${className}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ControlledEditor<PostCommentFormFields>
                    name="content"
                    control={control}
                    error={errors.content?.message}
                    variant={RichTextEditorVariantType.DEFAULT}
                    formId={isReply ? "reply" : "comment"}
                />

                <FormActionButtons
                    onCancel={onClose}
                    submitLabel={commentToEdit ? "Edit" : "Comment"}
                />
            </form>
        </div>
    );
}
