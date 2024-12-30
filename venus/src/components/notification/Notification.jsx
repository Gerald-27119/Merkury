import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notificationAction } from "../../redux/notification.jsx";

export default function Notification() {
  const title = useSelector((state) => state.notification.title);
  const message = useSelector((state) => state.notification.message);
  const isOpen = useSelector((state) => state.notification.isOpen);
  const error = useSelector((state) => state.notification.error);
  const success = useSelector((state) => state.notification.success);
  const info = useSelector((state) => state.notification.info);
  const dispatch = useDispatch();

  const [progrress, setProgrress] = useState(100);

  useEffect(() => {
    const duration = 5000;
    setProgrress(100);

    const interval = setInterval(() => {
      setProgrress((prevState) =>
        Math.max(prevState - 100 / (duration / 100), 0),
      );
    }, 100);

    const timer = setTimeout(
      () => dispatch(notificationAction.closeNotification()),
      5000,
    );
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [dispatch, isOpen]);

  if (!isOpen) {
    return null;
  }

  let classesH1 = "";
  let classesDiv = "";
  let classesProgress = "";

  if (error) {
    classesH1 += " text-red-600";
    classesDiv += " border-red-600";
    classesProgress += " bg-red-600";
  } else if (success) {
    classesH1 += " text-green-600";
    classesDiv += " border-green-600";
    classesProgress += " bg-green-600";
  } else if (info) {
    classesH1 += " text-yellow-600";
    classesDiv += " border-yellow-600";
    classesProgress += " bg-yellow-600";
  }

  return (
    <div
      className={`w-72 h-32 rounded-md shadow-md absolute top-4 right-4 z-50 bg-white p-4 space-y-2 border-2 ${classesDiv}`}
    >
      <div className="flex justify-between">
        <h1 className={`text-2xl font-semibold ${classesH1}`}>{title}</h1>
        <button
          onClick={() => dispatch(notificationAction.closeNotification())}
        >
          <IoIosClose size={30} />
        </button>
      </div>
      <p className="text-base">{message}</p>
      <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute h-full ${classesProgress}`}
          style={{ width: `${progrress}%` }}
        ></div>
      </div>
    </div>
  );
}
