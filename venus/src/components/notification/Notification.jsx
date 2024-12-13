import { IoIosClose } from "react-icons/io";
import { useEffect } from "react";
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

  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(notificationAction.closeNotification()),
      5000,
    );
    return () => clearTimeout(timer);
  }, [dispatch, isOpen]);

  if (!isOpen) {
    return null;
  }

  let classes = "";

  if (error) {
    classes += " text-red-600";
  } else if (success) {
    classes += " text-green-600";
  } else if (info) {
    classes += " text-yellow-600";
  }

  return (
    <div className="w-72 h-32 rounded-md shadow-md absolute top-4 right-4 z-50 bg-white p-4 space-y-2">
      <div className="flex justify-between">
        <h1 className={`text-2xl font-semibold ${classes}`}>{title}</h1>
        <button
          onClick={() => dispatch(notificationAction.closeNotification())}
        >
          <IoIosClose size={30} />
        </button>
      </div>
      <p className="text-base">{message}</p>
    </div>
  );
}
