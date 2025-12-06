import axios from "axios";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function uploadToAzure(file: File, containerName = "forum") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("containerName", containerName);

    const response = await axios.post(`${BASE_URL}/upload/media`, formData, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
