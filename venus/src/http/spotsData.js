import axios from "axios";

const API_URL = "http://localhost:8080/spot";

export async function fetchSpotsData({ signal }) {
  return (await axios.get(API_URL, { signal })).data;
}
