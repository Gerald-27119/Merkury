import { ChatMessageAttachedFileDto } from "../../../../../model/interface/chat/chatInterfaces";
import { FaDownload, FaFile } from "react-icons/fa";

export default function ChatMessageFiles({
    files,
}: {
    files: ChatMessageAttachedFileDto[] | null;
}) {
    return (
        <div className="flex flex-col gap-1">
            {files?.map((file) => (
                <>
                    <FaFile size={24} />
                    <div className="flex flex-col gap-2">
                        <p>{file.name}</p>
                        <span>{file.sizeInBytes} Bytes</span>
                    </div>
                    <FaDownload size={24} />
                </>
            ))}
        </div>
    );
}
