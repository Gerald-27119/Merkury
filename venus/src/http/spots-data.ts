import axios from "axios";
import queryString from "query-string";
import SpotDetails from "../model/interface/spot/spotDetails";
import GeneralSpot from "../model/interface/spot/generalSpot";
import SearchSpotDtoPage from "../model/interface/spot/search-spot/searchSpotDtoPage";
import { TopRatedSpot } from "../model/interface/spot/topRatedSpot";
import { SpotSearchRequestDto } from "../model/interface/spot/spotSearchRequestDto";
import { HomePageSpotPageDto } from "../model/interface/spot/search-spot/homePageSpotPageDto";
import SpotExpandedMediaGalleryPage from "../model/interface/spot/expanded-media-gallery/spotExpandedMediaGalleryPage";
import { MediaType } from "../model/enum/mediaType";
import { SpotExpandedGallerySortingType } from "../model/enum/spot/spotExpandedGallerySortingType";
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
    country?: string;
    region?: string;
    city?: string;
    userLongitude?: number;
    userLatitude?: number;
}

export async function getSearchedSpotsOnHomePage(
    searchLocation: SearchLocation,
    page: number,
    size: number,
): Promise<HomePageSpotPageDto> {
    return (
        await axios.get(`${BASE_URL}/public/spot/search/home-page`, {
            params: {
                country: searchLocation.country,
                region: searchLocation.region,
                city: searchLocation.city,
                userLongitude: searchLocation.userLongitude,
                userLatitude: searchLocation.userLatitude,
                page,
                size,
            },
        })
    ).data;
}

export async function getLocations(
    query: string | undefined,
    type: "city" | "region" | "country" | "tags",
): Promise<string[]> {
    return (
        await axios.get(`${BASE_URL}/public/spot/search/home-page/locations`, {
            params: {
                query,
                type,
            },
        })
    ).data;
}

export async function getSearchedSpotsOnAdvanceHomePage(
    spotSearchRequestDto: SpotSearchRequestDto,
    page: number,
    size: number,
): Promise<HomePageSpotPageDto> {
    return (
        await axios.get(`${BASE_URL}/public/spot/search/home-page/advance`, {
            params: { ...spotSearchRequestDto, page, size },
            paramsSerializer: (params) => queryString.stringify(params),
        })
    ).data;
}

export async function getPaginatedExpandedSpotMediaGallery(
    spotId: number,
    mediaType: MediaType,
    sorting: SpotExpandedGallerySortingType,
    page: number,
): Promise<SpotExpandedMediaGalleryPage> {
    return (
        await axios.get(`${BASE_URL}/public/spot/gallery`, {
            params: {
                spotId,
                mediaType,
                sorting,
                page,
            },
            withCredentials: true,
        })
    ).data;
}

export async function getExpandedSpotMediaGalleryPagePosition(
    spotId: number,
    mediaId: number,
    mediaType: MediaType,
    sorting: SpotExpandedGallerySortingType,
): Promise<{ mediaPagePosition: number }> {
    return (
        await axios.get(`${BASE_URL}/public/spot/gallery-media-position`, {
            params: {
                spotId,
                mediaId,
                mediaType,
                sorting,
                page: 0,
            },
            withCredentials: true,
        })
    ).data;
}
