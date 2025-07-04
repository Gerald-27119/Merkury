import axios from "axios";
import SpotDetails from "../model/interface/spot/spotDetails";
import GeneralSpot from "../model/interface/spot/generalSpot";
import SearchSpotDtoPage from "../model/interface/spot/searchSpotDtoPage";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function fetchFilteredSpots(name: string): Promise<GeneralSpot[]> {
    return (await axios.get(`${BASE_URL}/public/spot/search/map?name=${name}`))
        .data;
}

export async function fetchSearchedSpotsPage(
    name: string,
    page: number,
    sorting: string,
): Promise<SearchSpotDtoPage> {
    return (
        await axios.get(
            `${BASE_URL}/public/spot/search/list?name=${name}&page=${page}&sorting=${sorting}`,
        )
    ).data;
}

export async function fetchSpotsNames(name: string): Promise<string[]> {
    return (await axios.get(`${BASE_URL}/public/spot/names?text=${name}`)).data;
}

export async function fetchSpotsDataById(
    id: number | null,
): Promise<SpotDetails> {
    return (await axios.get(`${BASE_URL}/public/spot/${id}`)).data;
}

export async function fetchUserFavouriteSpots(page) {
    return (
        await axios.get(`${BASE_URL}/spot/favourites`, {
            params: { page },
            withCredentials: true,
        })
    ).data;
}

export async function addSpotToFavourites(spotId) {
    return await axios.patch(
        `${BASE_URL}/spot/favourites/add/${spotId}`,
        null,
        {
            withCredentials: true,
        },
    );
}

export async function removeSpotFromFavourites(spotId) {
    return await axios.patch(
        `${BASE_URL}/spot/favourites/remove/${spotId}`,
        null,
        {
            withCredentials: true,
        },
    );
}

export async function isSpotFavourite(spotId) {
    return (
        await axios.get(`${BASE_URL}/spot/favourites/${spotId}`, {
            withCredentials: true,
        })
    ).data;
}
