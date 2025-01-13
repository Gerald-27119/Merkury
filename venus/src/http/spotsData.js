import axios from "axios";
import BASE_URL from "./baseUrl.js";

export async function fetchSpotsData() {
  return (await axios.get(`${BASE_URL}/public/spot`)).data;
}
