import axios from "axios";

const API_URL = "http://localhost:8080/public/spot";

export async function fetchSpotsData() {
  return (await axios.get(API_URL)).data;
}
