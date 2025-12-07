import axios from "axios";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function searchUsers(username: string): Promise<string[]> {
    return (
        await axios.get(
            `${BASE_URL}/public/user/search/hints/${encodeURIComponent(username)}`,
        )
    ).data;
}
