import axios from "axios";
import BASE_URL from "./baseUrl.js";

export async function fetchFilteredSpots(name, minRating, maxRating) {
  return (
    await axios.get(
      `${BASE_URL}/public/spot/filter?name=${name}&minRating=${minRating}&maxRating=${maxRating}`,
    )
  ).data;
}

export async function fetchSpotsNames(name) {
  return (await axios.get(`${BASE_URL}/public/spot/names?text=${name}`)).data;
}

export async function fetchSpotsDataById(id) {
  return (await axios.get(`${BASE_URL}/public/spot/${id}`)).data;
}

export async function fetchUserFavouriteSpots(page) {
  return (
    await axios.get(API_URL + "/favourites", {
      params: { page },
      withCredentials: true,
    })
  ).data;
}

export async function addSpotToFavourites(spotId) {
  return await axios.put(API_URL + "/favourites/add", null, {
    params: { spotId },
    withCredentials: true,
  });
}

export async function removeSpotFromFavourites(spotId) {
  return await axios.put(API_URL + "/favourites/remove", null, {
    params: { spotId },
    withCredentials: true,
  });
}

export async function isSpotFavourite(spotId) {
  return (
    await axios.get(API_URL + "/favourites/check", {
      params: { spotId },
      withCredentials: true,
    })
  ).data;
}
