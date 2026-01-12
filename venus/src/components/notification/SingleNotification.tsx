import useDispatchTyped from "../../hooks/useDispatchTyped";
import { useEffect, useState } from "react";
import { notificationAction } from "../../redux/notification";
import { IoIosClose } from "react-icons/io";

interface SingleNotificationProps {
    id: string;
    title: string;
    message: string;
    type: "error" | "info" | "success";
}

export default function SingleNotification({
    id,
    title,
    message,
    type,
}: SingleNotificationProps) {
    const dispatch = useDispatchTyped();

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
            () => dispatch(notificationAction.removeNotification({ id })),
            duration,
        );

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [dispatch, id]);

    const handleClickCloseNotification = () => {
        dispatch(notificationAction.removeNotification({ id }));
    };

    let classesH1 = "";
    let classesDiv = "";
    let classesProgress = "";

    if (type === "error") {
        classesH1 += " text-red-600";
        classesDiv += " border-red-600";
        classesProgress += " bg-red-600";
    } else if (type === "success") {
        classesH1 += " text-green-600";
        classesDiv += " border-green-600";
        classesProgress += " bg-green-600";
    } else if (type === "info") {
        classesH1 += " text-yellow-600";
        classesDiv += " border-yellow-600";
        classesProgress += " bg-yellow-600";
    }

    return (
        <div
            className={`relative max-h-64 min-h-32 w-72 space-y-2 rounded-md border-2 bg-white p-4 shadow-md ${classesDiv}`}
        >
            <div className="flex justify-between">
                <h1 className={`text-2xl font-semibold ${classesH1}`}>
                    {title}
                </h1>
                <button
                    className="cursor-pointer"
                    onClick={handleClickCloseNotification}
                >
                    <IoIosClose size={30} />
                </button>
            </div>
            <p className="text-base">{message}</p>

            <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                    className={`absolute h-full ${classesProgress}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
