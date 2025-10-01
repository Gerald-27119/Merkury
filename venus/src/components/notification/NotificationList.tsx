import useSelectorTyped from "../../hooks/useSelectorTyped";
import SingleNotification from "./SingleNotification";

export default function NotificationList() {
    const { notifications } = useSelectorTyped((state) => state.notification);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-70 flex flex-col gap-4">
            {notifications.map((n) => (
                <SingleNotification
                    key={n.id}
                    id={n.id}
                    title={n.title}
                    message={n.message}
                    type={n.type}
                />
            ))}
        </div>
    );
}
