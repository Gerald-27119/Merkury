import axios from "axios";

const API_URL = "http://localhost:8080/spot";

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
