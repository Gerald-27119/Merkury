import Button from "../../../pages/account/Button.jsx";
import { IoCloseOutline } from "react-icons/io5";

export default function ExpandedPhoto({ children, onClose, author, title }) {
  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-95 flex justify-center items-center w-screen h-screen">
      <Button onClick={onClose} classNames="absolute top-2 right-2">
        <IoCloseOutline
          className="text-white bg-red-500 hover:bg-red-700 hover:text-gray-200"
          size={20}
        />
      </Button>
      <div className="flex-col">
        <div className="text-xl text-white text-center">{title}</div>
        <div>{children}</div>
        <div className="text-lg text-white ml-2">Author:&nbsp;{author}</div>
      </div>
    </div>
  );
}
