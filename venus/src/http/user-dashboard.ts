import axios from "axios";
import UserProfile from "../model/interface/account/profile/userProfile";
import { FavoriteSpotsListType } from "../model/enum/account/favorite-spots/favoriteSpotsListType";
import { UserRelationEditType } from "../model/enum/account/social/userRelationEditType";
import ExtendedUserProfile from "../model/interface/account/profile/extendedUserProfile";
import { DateSortType } from "../model/enum/account/photos/dateSortType";
import UserEditData from "../model/interface/account/settings/userEditData";
import UserData from "../model/interface/account/settings/userData";
import { DatedMediaGroupPageDto } from "../model/interface/account/media/datedMediaGroupPageDto";
import { FavoriteSpotPageDto } from "../model/interface/account/favorite-spots/favoriteSpotPageDto";
import { DatedCommentsGroupPageDto } from "../model/interface/account/comments/datedCommentsGroupPageDto";
import { SocialPageDto } from "../model/interface/account/social/socialPageDto";
import { AddSpotPageDto } from "../model/interface/account/add-spot/addSpotPageDto";
import { SpotToAddDto } from "../model/interface/account/add-spot/spotToAddDto";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getUserOwnProfile(): Promise<UserProfile> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/profile`, {
            withCredentials: true,
        })
    ).data;
}

export async function getProfileForViewer(
    username: string,
): Promise<ExtendedUserProfile> {
    return (
        await axios.get(
            `${BASE_URL}/public/user-dashboard/profile/${username}`,
            {
                withCredentials: true,
            },
        )
    ).data;
}

export async function getUserOwnFriends(
    page: number,
    size: number,
): Promise<SocialPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/friends`, {
            withCredentials: true,
            params: {
                page,
                size,
            },
        })
    ).data;
}

export async function getUserFriendsForViewer(
    username: string,
    page: number,
    size: number,
): Promise<SocialPageDto> {
    return (
        await axios.get(
            `${BASE_URL}/public/user-dashboard/friends/${username}`,
            {
                params: {
                    page,
                    size,
                },
            },
        )
    ).data;
}

interface EditUserFriendsProps {
    friendUsername: string;
    type: UserRelationEditType;
}

export async function editUserFriends({
    friendUsername,
    type,
}: EditUserFriendsProps): Promise<void> {
    return (
        await axios.patch(
            `${BASE_URL}/user-dashboard/friends`,
            {},
            {
                withCredentials: true,
                params: {
                    friendUsername,
                    type,
                },
            },
        )
    ).data;
}

export async function getUserOwnFollowed(
    page: number,
    size: number,
): Promise<SocialPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/followed`, {
            withCredentials: true,
            params: {
                page,
                size,
            },
        })
    ).data;
}

export async function getUserFollowedForViewer(
    username: string,
    page: number,
    size: number,
): Promise<SocialPageDto> {
    return (
        await axios.get(
            `${BASE_URL}/public/user-dashboard/followed/${username}`,
            {
                params: {
                    page,
                    size,
                },
            },
        )
    ).data;
}

export async function getUserOwnFollowers(
    page: number,
    size: number,
): Promise<SocialPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/followers`, {
            withCredentials: true,
            params: {
                page,
                size,
            },
        })
    ).data;
}

export async function getUserFollowersForViewer(
    username: string,
    page: number,
    size: number,
): Promise<SocialPageDto> {
    return (
        await axios.get(
            `${BASE_URL}/public/user-dashboard/followers/${username}`,
            {
                params: {
                    page,
                    size,
                },
            },
        )
    ).data;
}

interface EditUserFollowedProps {
    followedUsername: string;
    type: UserRelationEditType;
}

export async function editUserFollowed({
    followedUsername,
    type,
}: EditUserFollowedProps): Promise<void> {
    return (
        await axios.patch(
            `${BASE_URL}/user-dashboard/followed`,
            {},
            {
                withCredentials: true,
                params: {
                    followedUsername,
                    type,
                },
            },
        )
    ).data;
}

export async function getSortedUserPhotos(
    type: DateSortType,
    from: string | null,
    to: string | null,
    page: number,
    size: number,
): Promise<DatedMediaGroupPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/photos`, {
            withCredentials: true,
            params: { type, from, to, page, size },
        })
    ).data;
}

export async function getUserFavoriteSpots(
    type: FavoriteSpotsListType,
    page: number,
    size: number,
): Promise<FavoriteSpotPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/favorite-spots`, {
            withCredentials: true,
            params: { type, page, size },
        })
    ).data;
}

interface RemoveFavoriteSpotProps {
    type: FavoriteSpotsListType;
    spotId: number;
}

export async function removeFavoriteSpot({
    type,
    spotId,
}: RemoveFavoriteSpotProps): Promise<void> {
    return (
        await axios.patch(
            `${BASE_URL}/user-dashboard/favorite-spots`,
            {},
            {
                withCredentials: true,
                params: {
                    type,
                    spotId,
                },
            },
        )
    ).data;
}

export async function getAllUserComments(
    type: DateSortType,
    from: string | null,
    to: string | null,
    page: number,
    size: number,
): Promise<DatedCommentsGroupPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/comments`, {
            withCredentials: true,
            params: { type, from, to, page, size },
        })
    ).data;
}

export async function editUserSettings(userEdit: UserEditData): Promise<void> {
    return await axios.patch(`${BASE_URL}/user-dashboard/settings`, userEdit, {
        withCredentials: true,
    });
}

export async function getUserData(): Promise<UserData> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/settings`, {
            withCredentials: true,
        })
    ).data;
}

export async function getSortedUserMovies(
    type: DateSortType,
    from: string | null,
    to: string | null,
    page: number,
    size: number,
): Promise<DatedMediaGroupPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/movies`, {
            withCredentials: true,
            params: { type, from, to, page, size },
        })
    ).data;
}

export async function getAllUserPhotos(
    username: string,
    page: number,
    size: number,
): Promise<DatedMediaGroupPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/photos/${username}`, {
            withCredentials: true,
            params: { page, size },
        })
    ).data;
}

export async function getAllSpotsAddedByUser(
    page: number,
    size: number,
): Promise<AddSpotPageDto> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/add-spot`, {
            withCredentials: true,
            params: { page, size },
        })
    ).data;
}

export async function addSpot(spot: SpotToAddDto): Promise<void> {
    const formData = new FormData();

    formData.append(
        "spot",
        JSON.stringify({
            id: spot.id,
            name: spot.name,
            description: spot.description,
            country: spot.country,
            region: spot.region,
            city: spot.city,
            street: spot.street,
            borderPoints: spot.borderPoints,
        }),
    );

    spot.media.forEach((file) => {
        formData.append("media", file);
    });

    return (
        await axios.post(`${BASE_URL}/user-dashboard/add-spot`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        })
    ).data;
}

export async function fetchCoordinates(address: string) {
    const response = await axios.get(
        "https://us1.locationiq.com/v1/search.php",
        {
            params: {
                key: "pk.0187a0e8d784a740b9795e9911e5dbe5",
                q: address,
                format: "json",
                limit: 1,
            },
        },
    );

    if (!response.data || response.data.length === 0) {
        return null;
    }

    const { lat, lon } = response.data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
}
