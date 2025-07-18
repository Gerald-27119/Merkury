import axios from "axios";
import { TrendingGifCategory } from "../model/interface/chat/gifs/gifInterfaces";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function trendingTenorGifs(): Promise<TrendingGifCategory[]> {
    return (await axios.get(`${BASE_URL}/trending`)).data;
}

// export function searchTenorGifs() {
//     return axios.get(`${TENOR_BASE_URL}/search`, {
//         params: {
//             key: TENOR_API_KEY,
//         },
//     });
// }

//TODO: przydałoby sie przchowywanie informacji o jezyku uzytkownika oraz kraju i wysyłać do Tenora
