import axios from "axios";
import SpotDetails from "../model/interface/spot/spotDetails";
import GeneralSpot from "../model/interface/spot/generalSpot";
import SearchSpotDtoPage from "../model/interface/spot/search-spot/searchSpotDtoPage";
import { TopRatedSpot } from "../model/interface/spot/topRatedSpot";
import SearchSpotDto from "../model/interface/spot/search-spot/searchSpotDto";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function fetchFilteredSpots(name: string): Promise<GeneralSpot[]> {
    return (await axios.get(`${BASE_URL}/public/spot/search/map?name=${name}`))
        .data;
}

export async function getCurrentViewSpots(
    swLng: number,
    swLat: number,
    neLng: number,
    neLat: number,
    name: string,
    ratingFrom: number,
    sorting: string,
    page: number,
): Promise<SearchSpotDtoPage> {
    return (
        await axios.get(`${BASE_URL}/public/spot/current-view`, {
            params: {
                swLng,
                swLat,
                neLng,
                neLat,
                name,
                ratingFrom,
                sorting,
                page,
            },
        })
    ).data;
}

export async function getSpotsNamesInCurrentView(
    swLng: number,
    swLat: number,
    neLng: number,
    neLat: number,
    name: string,
): Promise<string[]> {
    return (
        await axios.get(`${BASE_URL}/public/spot/current-view/spot-names`, {
            params: { swLng, swLat, neLng, neLat, name },
        })
    ).data;
}

export async function fetchSearchedSpotsPage(
    name: string,
    page: number,
    sorting: string,
): Promise<SearchSpotDtoPage> {
    return (
        await axios.get(`${BASE_URL}/public/spot/search/list`, {
            params: { name, page, sorting },
        })
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

export async function get18MostPopularSpots(): Promise<TopRatedSpot[]> {
    return (await axios.get(`${BASE_URL}/public/spot/most-popular`)).data;
}

interface SearchLocation {
    country: string;
    region: string;
    city: string;
}

export async function getSearchedSpotsOnHomePage(
    searchLocation: SearchLocation,
): Promise<SearchSpotDto[]> {
    return (
        await axios.get(`${BASE_URL}/public/spot/search/home-page`, {
            params: {
                country: searchLocation.country,
                region: searchLocation.region,
                city: searchLocation.city,
            },
        })
    ).data;
}
