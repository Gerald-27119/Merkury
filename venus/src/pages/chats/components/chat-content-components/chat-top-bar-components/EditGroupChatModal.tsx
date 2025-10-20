import { FaX } from "react-icons/fa6";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../../../redux/notification";
import { chatActions } from "../../../../../redux/chats";
import { ChatDto } from "../../../../../model/interface/chat/chatInterfaces";
import {
    updateChatDetails,
    type UpdateChatPayload,
} from "../../../../../http/chats";
import { FaEdit } from "react-icons/fa"; // <— NOWY import

interface EditGroupChatModalProps {
    onClose?: () => void;
    chatDto: ChatDto;
}

export default function EditGroupChatModal({
    onClose,
    chatDto,
}: EditGroupChatModalProps) {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const [name, setName] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const previewUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : null),
        [file],
    );

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: UpdateChatPayload) =>
            updateChatDetails(chatDto.id, payload),
        onSuccess: async (updated: ChatDto) => {
            // dispatch(chatActions.updateChat(updated));
            // opcjonalnie odśwież listę czatów / szczegóły
            await queryClient.invalidateQueries({ queryKey: ["chatList"] });
            await queryClient.invalidateQueries({
                queryKey: ["chat", chatDto.id],
            });
            dispatch(
                notificationAction.addSuccess({ message: "Chat updated." }),
            );
            onClose?.();
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Failed to update chat.",
                }),
            );
        },
    });

    function handleCloseModal() {
        onClose?.();
    }

    const handleChangeChatImg = (event: ChangeEvent<HTMLInputElement>) => {
        const picked = event.target.files?.[0] ?? null;
        setFile(picked);
    };

    const handleSave = async () => {
        const payload: UpdateChatPayload = {};
        const cleanName = name.trim();

        if (cleanName && cleanName !== (chatDto.name ?? ""))
            payload.name = cleanName;
        if (file) payload.image = file;

        if (Object.keys(payload).length === 0) {
            onClose?.();
            return;
        }
        await mutateAsync(payload);
    };

    const commonButtonsClasses =
        "px-16 py-2 hover:cursor-pointer hover:opacity-80 rounded-lg transition";

    return (
        <div className="relative flex flex-col items-center p-8">
            <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 cursor-pointer"
            >
                <FaX className="text-2xl hover:text-red-600" />
            </button>

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold">Edit Chat</h1>
            </div>

            <div className="relative p-3">
                <img
                    alt="chat image"
                    src={
                        previewUrl
                            ? previewUrl
                            : chatDto?.imgUrl
                              ? `/users/${chatDto.imgUrl}`
                              : "/users/default.png"
                    }
                    className="aspect-square h-40 rounded-full shadow-md"
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleChangeChatImg}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-black/40 text-white opacity-0 transition hover:opacity-100"
                >
                    <FaEdit />
                    <p>Change chat image</p>
                </button>
            </div>

            <div className="p-10">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={chatDto.name}
                    className="border-violetLight bg-violetDark focus:border-violetLighter w-[22rem] rounded-xl border p-2 text-white placeholder-white/60 focus:outline-none"
                />
            </div>

            <div className="mt-auto flex gap-2">
                <button
                    className={`${commonButtonsClasses} bg-violetDark`}
                    onClick={handleCloseModal}
                >
                    Cancel
                </button>
                <button
                    className={`${commonButtonsClasses} bg-green-600 text-white disabled:opacity-50`}
                    onClick={handleSave}
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}
