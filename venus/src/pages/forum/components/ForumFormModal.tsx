import { createPortal } from "react-dom";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { tinymceForumConfig } from "../../../utils/tinymce/tinymceForumConfig";

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function ForumFormModal({ onClose, isOpen }: ModalProps) {
  const modalRoot = document.getElementById("modal");
  const editorRef = useRef<TinyMCEEditor | null>(null);

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
          </div>
        </>
      )}
    </div>,
    modalRoot,
  );
}
