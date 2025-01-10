import axios from "axios";
import BASE_URL from "./baseUrl.js";
const API_URL = `${BASE_URL}/spot`;

export async function fetchSpotsData() {
  return (await axios.get(API_URL)).data;
}
