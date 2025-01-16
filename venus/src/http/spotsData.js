import axios from "axios";

const API_URL = "http://localhost:8080/spot";

export async function fetchSpotsData() {
  return (await axios.get(API_URL)).data;
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
