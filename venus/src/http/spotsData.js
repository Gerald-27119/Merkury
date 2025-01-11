import axios from "axios";

const API_URL = "http://localhost:8080/spot";

export async function fetchSpotsData() {
  return (await axios.get(API_URL)).data;
}

export async function fetchFilteredSpots(name, minRating, maxRating) {
  const url =
    API_URL +
    `/filter?name=${name}&minRating=${minRating}&maxRating=${maxRating}`;
  return (await axios.get(url)).data;
}

export async function fetchSpotsNames() {
  const url = API_URL + "/names";
  return (await axios.get(url)).data;
}
