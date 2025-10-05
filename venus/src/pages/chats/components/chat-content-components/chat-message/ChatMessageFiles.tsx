import { ChatMessageAttachedFileDto } from "../../../../../model/interface/chat/chatInterfaces";
import {
    FaDownload,
    FaFile,
    FaFileAlt,
    FaFileArchive,
    FaFileAudio,
    FaFileCode,
    FaFileCsv,
    FaFileExcel,
    FaFileImage,
    FaFilePdf,
    FaFilePowerpoint,
    FaFileVideo,
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
                        {/* Cały obraz jako link do pobrania */}
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

                            {/* Overlay z ikoną, pojawia się na hover */}
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
                        className="bg-violetLightDarker flex w-[26rem] items-center gap-2 rounded-xl p-3"
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
                            <span>{file.sizeInBytes} Bytes</span>
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

// Wyciąga rozszerzenie z nazwy (bez kropki)
const getExt = (name?: string | null) =>
    name?.split(".").pop()?.toLowerCase() ?? null;

// Whitelist MIME — tylko to, co masz w enume
const MIME = {
    // obrazy
    JPEG: "image/jpeg",
    PNG: "image/png",
    GIF: "image/gif",
    WEBP: "image/webp",
    SVG: "image/svg+xml",

    // dokumenty
    PDF: "application/pdf",
    DOC: "application/msword",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLS: "application/vnd.ms-excel",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PPT: "application/vnd.ms-powerpoint",
    PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // tekstowe/strukturalne
    CSV: "text/csv",
    TXT: "text/plain",
    JSON: "application/json",
    XML: "application/xml",

    // archiwa
    ZIP: "application/zip",
    RAR: "application/vnd.rar",
    _7Z: "application/x-7z-compressed",
} as const;

// Fallback po rozszerzeniach (spójny z powyższym)
const EXT = {
    pdf: "pdf",
    doc: "doc",
    docx: "docx",
    xls: "xls",
    xlsx: "xlsx",
    ppt: "ppt",
    pptx: "pptx",
    csv: "csv",
    txt: "txt",
    json: "json",
    xml: "xml",
    zip: "zip",
    rar: "rar",
    "7z": "7z",
    // obrazy
    jpg: "jpg",
    jpeg: "jpeg",
    png: "png",
    gif: "gif",
    webp: "webp",
    svg: "svg",
} as const;

export function FileIcon({ mime, filename, className, size = 20 }: Props) {
    const ext = getExt(filename);

    // 1) Preferuj rozpoznanie po MIME (dokładne dopasowanie do whitelisty)
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

            // Obrazy – tylko te pięć
            case MIME.JPEG:
            case MIME.PNG:
            case MIME.GIF:
            case MIME.WEBP:
            case MIME.SVG:
                return <FaFileImage size={size} className={className} />;
        }
    }

    // 2) Fallback po rozszerzeniu (również tylko whitelist)
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

    // 3) Jeżeli typ nie jest na whitelist — ikona ogólna
    return <FaFile size={size} className={className} />;
}
