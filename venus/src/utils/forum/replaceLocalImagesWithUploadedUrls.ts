export async function replaceLocalImagesWithUploadedUrls(
    html: string,
    localImages: { id: string; file: File }[],
    uploadFn: (file: File) => Promise<string>,
): Promise<string> {
    const uploadedMap: Record<string, string> = {};

    for (const img of localImages) {
        uploadedMap[img.id] = await uploadFn(img.file);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("img").forEach((img) => {
        const id = img.alt;
        if (uploadedMap[id]) {
            img.src = uploadedMap[id];
            img.alt = "image";
        }
    });

    return doc.body.innerHTML;
}
