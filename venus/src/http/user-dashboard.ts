import axios from "axios";
import UserProfile from "../model/interface/account/profile/userProfile";
import { Friend } from "../model/interface/account/friends/friend";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getUserProfile(username: string): Promise<UserProfile> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/profile/${username}`, {
      withCredentials: true,
    })
  ).data;
}

export async function getUserFriends(username: string): Promise<Friend[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/friends/${username}`, {
      withCredentials: true,
    })
  ).data;
}

interface EditUserFriendsProps {
  username: string;
  friendUsername: string;
  type: string;
}

export async function editUserFriends({
  username,
  friendUsername,
  type,
}: EditUserFriendsProps): Promise<void> {
  return (
    await axios.patch(
      `${BASE_URL}/user-dashboard/friends/${username}?friendUsername=${friendUsername}&type=${type}`,
      {},
      {
        withCredentials: true,
      },
    )
  ).data;
}

export async function getUserFollowed(username: string): Promise<Friend[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/followed/${username}`, {
      withCredentials: true,
    })
  ).data;
}

export async function getUserFollowers(username: string): Promise<Friend[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/followers/${username}`, {
      withCredentials: true,
    })
  ).data;
}
