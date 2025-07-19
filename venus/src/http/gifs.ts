import axios from "axios";
import { TrendingGifCategory } from "../model/interface/chat/gifs/gifInterfaces";

const BACKEND_BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;
const GIFS_BASE_URL = BACKEND_BASE_URL + "/gifs";

export async function trendingTenorGifs(): Promise<TrendingGifCategory[]> {
    return (
        await axios.get(`${GIFS_BASE_URL}/trending`, {
            withCredentials: true,
        })
    ).data;
}

// export function searchTenorGifs() {
//     return axios.get(`${GIFS_BASE_URL}/search`, {
//         params: {
//             key: TENOR_API_KEY,
//         },
//     });
// }

//TODO: przydałoby sie przchowywanie informacji o jezyku uzytkownika oraz kraju i wysyłać do Tenora
