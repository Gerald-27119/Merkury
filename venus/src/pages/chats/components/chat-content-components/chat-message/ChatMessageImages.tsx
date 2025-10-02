import { ChatMessageAttachedFileDto } from "../../../../../model/interface/chat/chatInterfaces";

export default function ChatMessageImages(files: ChatMessageAttachedFileDto[]) {
    const truncatedFiles = null;

    return (
        <div className="flex gap-1">
            {files.map((file) => (
                <img src={file.url} alt={file.name} />
            ))}
        </div>
    );
}
