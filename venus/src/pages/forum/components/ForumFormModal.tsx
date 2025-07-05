import { createPortal } from "react-dom";
import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { tinymceForumConfig } from "../../../utils/tinymce/tinymceForumConfig";
import FormInput from "../../../components/form/FormInput";
import usePostFormValidation from "../../../hooks/usePostFormValidation";
import CategoryDto from "../../../model/interface/forum/categoryDto";
import TagDto from "../../../model/interface/forum/tagDto";
import SelectWithSearch from "./SelectWithSearch";
import { useFormValidation } from "../../../hooks/useFormValidation";

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  categories: CategoryDto[];
  tags: TagDto[];
}

export default function ForumFormModal({
  onClose,
  isOpen,
  categories,
  tags,
}: ModalProps) {
  const modalRoot = document.getElementById("modal");
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const {
    enteredValue,
    isValid,
    handleInputChange,
    handleInputBlur,
    validate,
  } = usePostFormValidation({
    title: "",
    category: "",
    tags: [],
  });

  if (!modalRoot) {
    return null;
  }

  const handlePost = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      console.log("Posting content:", content);
      onClose();
    }
  };

  return createPortal(
    <div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70"
            onClick={onClose}
          ></div>
          <div className="dark:bg-darkBgSoft dark:text-darkText bg-lightBgSoft text-lightText fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-md p-8 shadow-md">
            <button
              className="absolute top-0 right-3 text-4xl font-bold text-gray-500 hover:text-red-500"
              onClick={onClose}
            >
              x
            </button>

            <form onSubmit={handlePost} className="flex flex-col gap-4">
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={enteredValue.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                onBlur={() => handleInputBlur("title")}
                // isValid={isValid.title}
                className="dark:bg-darkBg rounded-lg p-2"
              />

              <SelectWithSearch
                placeholder="Category"
                isMultiChoice={false}
                options={categoryOptions}
                value={enteredValue.category}
                onChange={(value) => handleInputChange("category", value)}
                onBlur={() => handleInputBlur("category")}
                isValid={isValid.category}
              />

              <SelectWithSearch
                placeholder="Tags"
                isMultiChoice={true}
                options={tagOptions}
                value={enteredValue.tags}
                onChange={(value) => handleInputChange("tags", value)}
                onBlur={() => handleInputBlur("tags")}
                isValid={isValid.tags}
              />

              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                onInit={(event: any, editor: TinyMCEEditor) =>
                  (editorRef.current = editor)
                }
                init={tinymceForumConfig}
              ></Editor>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={handlePost}
                  className="dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight rounded px-4 py-2 text-white"
                >
                  Post
                </button>
                <button
                  onClick={onClose}
                  className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>,
    modalRoot,
  );
}
