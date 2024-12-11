import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";

export default function Notification({ title, message }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-72 h-32 rounded-md shadow-md absolute top-4 right-4 z-50 bg-white p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <button onClick={() => setIsOpen(false)}>
          <IoIosClose size={30} />
        </button>
      </div>
      <p className="text-lg">{message}</p>
    </div>
  );
}
