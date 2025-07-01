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

    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const duration = 5000;
        setProgress(100);

        const interval = setInterval(() => {
            setProgress((prevState) =>
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

    const handleClickCloseNotification = () => {
        dispatch(notificationAction.closeNotification());
    };

    return (
        <div
            className={`absolute top-4 right-4 z-50 max-h-64 min-h-32 w-72 space-y-2 rounded-md border-2 bg-white p-4 shadow-md ${classesDiv}`}
        >
            <div className="flex justify-between">
                <h1 className={`text-2xl font-semibold ${classesH1}`}>
                    {title}
                </h1>
                <button onClick={handleClickCloseNotification}>
                    <IoIosClose size={30} />
                </button>
            </div>
            <p className="text-base">
                {typeof message === "object" && message !== null ? (
                    <>
                        {message.message && <span>{message.message}</span>}
                        {message.error && <span> {message.error}</span>}
                    </>
                ) : (
                    message
                )}
            </p>

            <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                    className={`absolute h-full ${classesProgress}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
