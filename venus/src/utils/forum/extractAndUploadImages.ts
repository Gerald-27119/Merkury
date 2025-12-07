import { base64ToFile } from "./base64ToFile";

export async function extractAndUploadImages(
    html: string,
    uploadFn: (file: File) => Promise<string>,
): Promise<string> {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const imageElements = Array.from(doc.querySelectorAll("img"));

    for (const img of imageElements) {
        const src = img.getAttribute("src");
        if (!src?.startsWith("data:")) continue;

        const [, meta, base64] = src.match(/^data:(.*?);base64,(.*)$/) || [];
        if (!meta || !base64) continue;

        const mime = meta;
        const filename = `image-${crypto.randomUUID()}.${mime.split("/")[1]}`;

        const file = base64ToFile(base64, filename, mime);
        img.src = await uploadFn(file);
    }

    return doc.body.innerHTML;
}
