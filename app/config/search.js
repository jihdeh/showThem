import googleRequest from "./google-requests";
const API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

async function search(searchText, type) {
  const request = {
    url: API_URL,
    params: { key: process.env.GOOGLE_API_KEY, query: searchText },
    method: "get"
  }
  const textResult = googleRequest(request, type);
  return textResult;
}

export default search;
