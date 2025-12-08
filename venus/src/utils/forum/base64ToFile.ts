export function base64ToFile(
    base64Data: string,
    filename: string,
    mime: string,
): File {
    let binary: string;

    try {
        //atob() - decodes a string of data which has been encoded using Base64 encoding.
        binary = atob(base64Data);
    } catch (err) {
        throw new Error("Invalid base64 data");
    }
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], filename, { type: mime });
}
