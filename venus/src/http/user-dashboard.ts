import axios from "axios";
import UserProfile from "../model/interface/account/profile/userProfile";
import { SocialDto } from "../model/interface/account/social/socialDto";
import { FavoriteSpot } from "../model/interface/account/favorite-spots/favoriteSpot";
import { FavoriteSpotsListType } from "../model/enum/account/favorite-spots/favoriteSpotsListType";
import { UserRelationEditType } from "../model/enum/account/social/userRelationEditType";
import ExtendedUserProfile from "../model/interface/account/profile/extendedUserProfile";
import DatedMediaGroup from "../model/interface/account/media/datedMediaGroup";
import { DateSortType } from "../model/enum/account/photos/dateSortType";
import DatedCommentsGroup from "../model/interface/account/comments/datedCommentsGroup";
import UserEditData from "../model/interface/account/settings/userEditData";
import UserData from "../model/interface/account/settings/userData";
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

export async function getUserOwnFriends(): Promise<SocialDto[]> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/friends`, {
            withCredentials: true,
        })
    ).data;
}

export async function getUserFriendsForViewer(
    username: string,
): Promise<SocialDto[]> {
    return (
        await axios.get(`${BASE_URL}/public/user-dashboard/friends/${username}`)
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

export async function getUserOwnFollowed(): Promise<SocialDto[]> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/followed`, {
            withCredentials: true,
        })
    ).data;
}

export async function getUserFollowedForViewer(
    username: string,
): Promise<SocialDto[]> {
    return (
        await axios.get(
            `${BASE_URL}/public/user-dashboard/followed/${username}`,
        )
    ).data;
}

export async function getUserOwnFollowers(): Promise<SocialDto[]> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/followers`, {
            withCredentials: true,
        })
    ).data;
}

export async function getUserFollowersForViewer(
    username: string,
): Promise<SocialDto[]> {
    return (
        await axios.get(
            `${BASE_URL}/public/user-dashboard/followers/${username}`,
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

interface DateRangeSortProps {
    type: DateSortType;
    from: string | null;
    to: string | null;
}

export async function getSortedUserPhotos({
    type,
    from,
    to,
}: DateRangeSortProps): Promise<DatedMediaGroup[]> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/photos`, {
            withCredentials: true,
            params: { type, from, to },
        })
    ).data;
}

export async function getUserFavoriteSpots(
    type: FavoriteSpotsListType,
): Promise<FavoriteSpot[]> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/favorite-spots`, {
            withCredentials: true,
            params: type,
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

export async function getAllUserComments({
    type,
    from,
    to,
}: DateRangeSortProps): Promise<DatedCommentsGroup[]> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/comments`, {
            withCredentials: true,
            params: { type, from, to },
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

export async function getSortedUserMovies({
    type,
    from,
    to,
}: DateRangeSortProps): Promise<DatedMediaGroup[]> {
    return (
        await axios.get(`${BASE_URL}/user-dashboard/movies`, {
            withCredentials: true,
            params: { type, from, to },
        })
    ).data;
}
