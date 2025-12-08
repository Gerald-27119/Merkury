import { base64ToFile } from "./base64ToFile";

export async function extractAndUploadImages(
    html: string,
    uploadFn: (file: File) => Promise<string>,
): Promise<string> {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const imageElements = Array.from(doc.querySelectorAll("img"));

    await Promise.all(
        imageElements.map(async (img) => {
            const src = img.getAttribute("src");
            if (!src?.startsWith("data:")) return;

            const match = src.match(/^data:(.*?);base64,(.*)$/);
            if (!match) throw new Error("Invalid base64 image format");

            const [, mime, base64] = match;
            const extension = mime.split("/")[1] || "png";
            const filename = `image-${crypto.randomUUID()}.${extension}`;

            const file = base64ToFile(base64, filename, mime);
            try {
                img.src = await uploadFn(file);
            } catch (e) {
                throw new Error("Image upload failed");
            }
        }),
    );

    return doc.body.innerHTML;
}
