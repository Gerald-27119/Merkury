import axios from "axios";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function uploadToAzure(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${BASE_URL}/upload/media`, formData, {
        withCredentials: true,
    });

    return response.data;
}
