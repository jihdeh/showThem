import axios from "axios";
import getRequestImages from "./google-text-search";
import getMapRequestImages from "./google-map-search";

async function googleRequestAPI(request, type) {
  try {
    const response = await axios(request);
    const newResponse = response.data.results.splice(0, 10);
    if (newResponse.length > 0) {
      switch (type) {
        case "photo":
          const endPhotoResponse = await getRequestImages(newResponse);
          return endPhotoResponse;
          break;
        case "map":
          const endMapResponse = await getMapRequestImages(newResponse);
          return endMapResponse;
          break;
        default:
          return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.trace("error fetching place", error);
  }
}

export default googleRequestAPI;
