import { SubmitHandler, useForm } from "react-hook-form";
import Option from "../../../../model/interface/forum/selectOption";
import { zodResolver } from "@hookform/resolvers/zod";
import PostFormInput from "./PostFormInput";
import ControlledEditor from "./ControlledEditor";
import {
    PostFormFields,
    PostFormSchema,
} from "../../../../model/zod-schemas/postFormSchema";
import ControlledSelect from "../../components/ControlledSelect";
import PostDto from "../../../../model/interface/forum/post/postDto";
import { RichTextEditorVariantType } from "../../../../model/enum/forum/richTextEditorVariantType";
import FormActionButtons from "../../components/FormActionButtons";
import { uploadToAzure } from "../../../../http/forum-file-upload";
import { extractAndUploadImages } from "../../../../utils/forum/extractAndUploadImages";

interface FormProps {
    handlePost: (data: PostDto) => void;
    onClose: () => void;
    categories: Option[];
    tags: Option[];
    postToEdit?: PostDto | null;
}

export default function PostForm({
    handlePost,
    onClose,
    categories,
    tags,
    postToEdit,
}: FormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm<PostFormFields>({
        resolver: zodResolver(PostFormSchema),
        mode: "onBlur",
        defaultValues: postToEdit
            ? {
                  title: postToEdit.title,
                  content: postToEdit.content,
                  category: {
                      value: postToEdit.category,
                      label: postToEdit.category,
                  },
                  tags: postToEdit.tags.map((tag) => ({
                      value: tag,
                      label: tag,
                  })),
              }
            : {
                  title: "",
                  category: null,
                  tags: [],
                  content: "",
              },
    });

    const onSubmit: SubmitHandler<PostFormFields> = async (data) => {
        const finalContent = await extractAndUploadImages(
            data.content,
            (file) => uploadToAzure(file),
        );

        let newPost = {
            title: data.title,
            content: finalContent,
            category: data.category!.value,
            tags: data.tags ? data.tags.map((tag) => tag.value) : [],
        };

        handlePost(newPost);
        onClose();
    };

    return (
        <div className="dark:bg-darkBgSoft dark:text-darkText bg-lightBg text-lightText fixed top-35 left-1/2 z-50 w-full max-w-xl min-w-sm -translate-x-1/2 rounded-md p-8 shadow-md">
            <button
                className="absolute top-0 right-3 cursor-pointer text-4xl font-bold text-gray-500 hover:text-red-500"
                onClick={onClose}
            >
                x
            </button>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <PostFormInput<PostFormFields>
                    name="title"
                    placeholder="Title"
                    type="text"
                    register={register}
                    error={errors.title?.message}
                />

                <ControlledSelect<PostFormFields>
                    name="category"
                    placeholder="Category"
                    control={control}
                    isMultiChoice={false}
                    options={categories}
                    error={errors.category?.message}
                />
                <ControlledSelect<PostFormFields>
                    name="tags"
                    placeholder="Tags"
                    control={control}
                    isMultiChoice={true}
                    options={tags}
                    error={errors.tags?.message}
                />

                <ControlledEditor<PostFormFields>
                    name="content"
                    control={control}
                    error={errors.content?.message}
                    variant={RichTextEditorVariantType.MODAL}
                    setError={setError}
                    clearErrors={clearErrors}
                />

                <FormActionButtons
                    onCancel={onClose}
                    submitLabel={postToEdit ? "Edit" : "Post"}
                />
            </form>
        </div>
    );
}
