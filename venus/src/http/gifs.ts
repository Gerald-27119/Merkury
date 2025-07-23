import axios from "axios";
import {
    SearchedGifs,
    TrendingGifCategory,
} from "../model/interface/chat/gifs/gifInterfaces";

const BACKEND_BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;
const GIFS_BASE_URL = BACKEND_BASE_URL + "/gifs";

export async function trendingTenorGifs(): Promise<TrendingGifCategory[]> {
    return (
        await axios.get(`${GIFS_BASE_URL}/trending`, {
            withCredentials: true,
        })
    ).data;
}

export async function searchTenorGifs(
    searchedInputPhrase: string,
    pageParam: string = "",
): Promise<SearchedGifs> {
    return (
        await axios.get(`${GIFS_BASE_URL}/search`, {
            params: {
                searchPhrase: searchedInputPhrase,
                next: pageParam,
            },
            withCredentials: true,
        })
    ).data;
}

//TODO: przydałoby sie przchowywanie informacji o jezyku uzytkownika oraz kraju i wysyłać do Tenora
