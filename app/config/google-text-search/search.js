import googleRequest from "../google-requests";
const API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

async function search(searchText) {
  const request = {
    uri: API_URL,
    query: searchText
  }
  const textResult = googleRequest(request);
  return textResult;
}

export default search;
