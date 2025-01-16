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
