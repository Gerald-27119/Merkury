import { ChatMessageAttachedFileDto } from "../../../../../model/interface/chat/chatInterfaces";
import {
    FaDownload,
    FaFile,
    FaFileAlt,
    FaFileArchive,
    FaFileCode,
    FaFileCsv,
    FaFileExcel,
    FaFileImage,
    FaFilePdf,
    FaFilePowerpoint,
    FaFileWord,
} from "react-icons/fa";

export default function ChatMessageFiles({
    files,
}: {
    files: ChatMessageAttachedFileDto[] | null;
}) {
    const isImage = (mime?: string | null) =>
        typeof mime === "string" && mime.startsWith("image/");

    if (!files?.length) return null;

    return (
        <div className="mt-2 flex flex-col gap-2">
            {files.map((file) =>
                isImage(file.fileType) ? (
                    <div
                        key={file.url}
                        className="group relative w-[26rem] overflow-hidden rounded-xl"
                    >
                        <a
                            href={file.url}
                            download={file.name}
                            title={`Pobierz: ${file.name}`}
                            className="block"
                        >
                            <img
                                src={file.url}
                                alt={file.name}
                                loading="lazy"
                                draggable={false}
                                className="block max-h-64 w-full cursor-pointer object-cover transition duration-300 select-none group-hover:scale-[1.01] group-hover:brightness-75"
                            />

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                                <FaDownload
                                    size={48}
                                    className="text-white drop-shadow-lg"
                                />
                            </div>
                        </a>
                    </div>
                ) : (
                    <div
                        key={file.url}
                        className="dark:bg-violetLightDarker flex w-[26rem] items-center gap-2 rounded-xl border border-gray-300 p-3 dark:border-0"
                    >
                        <FileIcon
                            size={34}
                            filename={file.name}
                            mime={file.fileType}
                        />
                        <div className="flex w-full min-w-0 flex-col">
                            <p className="truncate" title={file.name}>
                                {file.name}
                            </p>

                            <span title={`${file.sizeInBytes} B`}>
                                {bytesToMB(file.sizeInBytes, {
                                    binary: true,
                                    decimals: 2,
                                })}
                            </span>
                        </div>
                        <a
                            href={file.url}
                            download={file.name}
                            title="download"
                        >
                            <FaDownload className="hover:text-violetLight transition-colors duration-300 hover:cursor-pointer" />
                        </a>
                    </div>
                ),
            )}
        </div>
    );
}

type Props = {
    mime?: string | null;
    filename?: string | null;
    className?: string;
    size?: number;
};

const getExt = (name?: string | null) =>
    name?.split(".").pop()?.toLowerCase() ?? null;

function bytesToMB(
    bytes?: number | null,
    opts: { binary?: boolean; decimals?: number } = {},
): string {
    const { binary = true, decimals = 2 } = opts;
    if (bytes == null || !Number.isFinite(bytes)) return "—";
    // TODO
    const denom = binary ? 1024 * 1024 : 1_000_000;
    const unit = binary ? "MiB" : "MB";
    return `${(bytes / denom).toFixed(decimals)} ${unit}`;
}

const MIME = {
    JPEG: "image/jpeg",
    PNG: "image/png",
    GIF: "image/gif",
    WEBP: "image/webp",
    SVG: "image/svg+xml",

    PDF: "application/pdf",
    DOC: "application/msword",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLS: "application/vnd.ms-excel",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PPT: "application/vnd.ms-powerpoint",
    PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    CSV: "text/csv",
    TXT: "text/plain",
    JSON: "application/json",
    XML: "application/xml",

    ZIP: "application/zip",
    RAR: "application/vnd.rar",
    _7Z: "application/x-7z-compressed",
} as const;

export function FileIcon({ mime, filename, className, size = 20 }: Props) {
    const ext = getExt(filename);

    if (mime) {
        switch (mime) {
            case MIME.PDF:
                return <FaFilePdf size={size} className={className} />;
            case MIME.DOC:
            case MIME.DOCX:
                return <FaFileWord size={size} className={className} />;
            case MIME.XLS:
            case MIME.XLSX:
                return <FaFileExcel size={size} className={className} />;
            case MIME.PPT:
            case MIME.PPTX:
                return <FaFilePowerpoint size={size} className={className} />;
            case MIME.CSV:
                return <FaFileCsv size={size} className={className} />;
            case MIME.TXT:
                return <FaFileAlt size={size} className={className} />;
            case MIME.JSON:
            case MIME.XML:
                return <FaFileCode size={size} className={className} />;
            case MIME.ZIP:
            case MIME.RAR:
            case MIME._7Z:
                return <FaFileArchive size={size} className={className} />;
            case MIME.JPEG:
            case MIME.PNG:
            case MIME.GIF:
            case MIME.WEBP:
            case MIME.SVG:
                return <FaFileImage size={size} className={className} />;
        }
    }

    if (ext) {
        if (["pdf"].includes(ext))
            return <FaFilePdf size={size} className={className} />;
        if (["doc", "docx"].includes(ext))
            return <FaFileWord size={size} className={className} />;
        if (["xls", "xlsx"].includes(ext))
            return <FaFileExcel size={size} className={className} />;
        if (["ppt", "pptx"].includes(ext))
            return <FaFilePowerpoint size={size} className={className} />;
        if (["csv"].includes(ext))
            return <FaFileCsv size={size} className={className} />;
        if (["txt"].includes(ext))
            return <FaFileAlt size={size} className={className} />;
        if (["json", "xml"].includes(ext))
            return <FaFileCode size={size} className={className} />;
        if (["zip", "rar", "7z"].includes(ext))
            return <FaFileArchive size={size} className={className} />;
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
            return <FaFileImage size={size} className={className} />;
    }

    return <FaFile size={size} className={className} />;
}
