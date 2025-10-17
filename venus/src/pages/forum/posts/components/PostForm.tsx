import { SubmitHandler, useForm } from "react-hook-form";
import Option from "../../../../model/interface/forum/selectOption";
import { zodResolver } from "@hookform/resolvers/zod";
import PostFormInput from "./PostFormInput";
import PostFormEditor from "./PostFormEditor";
import {
    ForumPostFormFields,
    ForumPostFormSchema,
} from "../../../../model/schema/forumPostFormSchema";
import ControlledSelect from "../../components/ControlledSelect";
import PostDto from "../../../../model/interface/forum/post/postDto";
import { RichTextEditorVariantType } from "../../../../model/enum/forum/richTextEditorVariantType";

interface FormProps {
    handleAddPost: (data: PostDto) => void;
    onClose: () => void;
    categories: Option[];
    tags: Option[];
}

export default function PostForm({
    handleAddPost,
    onClose,
    categories,
    tags,
}: FormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ForumPostFormFields>({
        resolver: zodResolver(ForumPostFormSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            category: null,
            tags: [],
            content: "",
        },
    });

    const onSubmit: SubmitHandler<ForumPostFormFields> = (data) => {
        let newPost = {
            title: data.title,
            content: data.content,
            category: data.category!.value,
            tags: data.tags ? data.tags.map((tag) => tag.value) : [],
        };
        handleAddPost(newPost);
        onClose();
    };

    return (
        <div className="dark:bg-darkBgSoft dark:text-darkText bg-lightBgSoft text-lightText fixed top-35 left-1/2 z-50 w-full max-w-xl min-w-sm -translate-x-1/2 rounded-md p-8 shadow-md">
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
                <PostFormInput<ForumPostFormFields>
                    name="title"
                    placeholder="Title"
                    type="text"
                    register={register}
                    error={errors.title?.message}
                />

                <ControlledSelect<ForumPostFormFields>
                    name="category"
                    placeholder="Category"
                    control={control}
                    isMultiChoice={false}
                    options={categories}
                    error={errors.category?.message}
                />
                <ControlledSelect<ForumPostFormFields>
                    name="tags"
                    placeholder="Tags"
                    control={control}
                    isMultiChoice={true}
                    options={tags}
                    error={errors.tags?.message}
                />

                <PostFormEditor<ForumPostFormFields>
                    name="content"
                    control={control}
                    error={errors.content?.message}
                    variant={RichTextEditorVariantType.MODAL}
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
