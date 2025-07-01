import axios from "axios";
import UserProfile from "../model/interface/account/profile/userProfile";
import { SocialDto } from "../model/interface/account/social/socialDto";
import { FavoriteSpot } from "../model/interface/account/favorite-spots/favoriteSpot";
import { FavoriteSpotsListType } from "../model/enum/account/favorite-spots/favoriteSpotsListType";
import { UserRelationEditType } from "../model/enum/account/social/userRelationEditType";
import ExtendedUserProfile from "../model/interface/account/profile/extendedUserProfile";
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
    await axios.get(`${BASE_URL}/public/user-dashboard/profile/${username}`, {
      withCredentials: true,
    })
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
      `${BASE_URL}/user-dashboard/friends?friendUsername=${friendUsername}&type=${type}`,
      {},
      {
        withCredentials: true,
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
    await axios.get(`${BASE_URL}/public/user-dashboard/followed/${username}`)
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
    await axios.get(`${BASE_URL}/public/user-dashboard/followers/${username}`)
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
      `${BASE_URL}/user-dashboard/followed?followedUsername=${followedUsername}&type=${type}`,
      {},
      {
        withCredentials: true,
      },
    )
  ).data;
}

export async function getUserFavoriteSpots(
  type: FavoriteSpotsListType,
): Promise<FavoriteSpot[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/favorite-spots?type=${type}`, {
      withCredentials: true,
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
      `${BASE_URL}/user-dashboard/favorite-spots?type=${type}&spotId=${spotId}`,
      {},
      {
        withCredentials: true,
      },
    )
  ).data;
}
