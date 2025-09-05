import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: "error" | "success" | "info";
}

interface NotificationState {
    notifications: NotificationItem[];
    maxVisible: number;
}

const initialState: NotificationState = {
    notifications: [],
    maxVisible: 6,
};

const pushWithLimit = (
    state: NotificationState,
    notification: NotificationItem,
) => {
    if (state.notifications.length >= state.maxVisible) {
        state.notifications.shift();
    }
    state.notifications.push(notification);
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addError(state, action: PayloadAction<{ message: string }>) {
            pushWithLimit(state, {
                id: uuidv4(),
                title: "Error",
                message: action.payload.message || "An error occurred.",
                type: "error",
            });
        },
        addSuccess(state, action: PayloadAction<{ message: string }>) {
            pushWithLimit(state, {
                id: uuidv4(),
                title: "Success",
                message: action.payload.message || "Completed successfully.",
                type: "success",
            });
        },
        addInfo(state, action: PayloadAction<{ message: string }>) {
            pushWithLimit(state, {
                id: uuidv4(),
                title: "Info",
                message:
                    action.payload.message ||
                    "No action is needed at this moment.",
                type: "info",
            });
        },
        removeNotification(state, action: PayloadAction<{ id: string }>) {
            state.notifications = state.notifications.filter(
                (n) => n.id !== action.payload.id,
            );
        },
    },
});

export const notificationAction = notificationSlice.actions;
