import axios from "axios";
import BASE_URL from "./baseUrl.js";

export async function fetchFilteredSpots(name, minRating, maxRating) {
  return (
    await axios.get(
      `${API_URL}/filter?name=${name}&minRating=${minRating}&maxRating=${maxRating}`,
    )
  ).data;
}

export async function fetchSpotsNames(name) {
  return (await axios.get(`${API_URL}/names?text=${name}`)).data;
}
