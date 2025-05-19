import axios from "axios";
import UserProfile from "../model/interface/account/profile/userProfile";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getUserProfile(): Promise<UserProfile> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/profile`, {
      withCredentials: true,
    })
  ).data;
}
