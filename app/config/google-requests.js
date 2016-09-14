import axios from "axios";
import { mapSeries, waterfall, mapLimit } from "async";
import {get } from "lodash";

async function googleRequestAPI(data) {
  try {
    const response = await axios({
      url: data.uri,
      params: { key: process.env.GOOGLE_API_KEY, query: data.query },
      method: "get"
    });
    const endResponse = await getRequestImages(response.data.results);
    return endResponse;
  } catch (error) {
    console.trace("error fetching place", error);
  }
}


async function getRequestImages(candidates) {
  return new Promise(resolve => {
    mapSeries(candidates, async(result, cb) => {
      const photoReference = get(result, "photos.[0].photo_reference");
      if (photoReference !== undefined) {
        try {
          const res = await axios({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_API_KEY}`,
            method: "get",
            responseType: "arraybuffer"
          });
          const data = "data:" + res.headers["content-type"] + ";base64," + new Buffer(res.data).toString('base64');
          result = Object.assign({}, result, { image: data });
        } catch (error) {
          console.trace("Error occured getting photo references", error);
        }
      } else {
        result = Object.assign({}, result, { image: result.icon });
      }
      cb(null, result);
    }, (err, result) => {
      if (err) {
        console.log("error getting google images result", err);
        return;
      }
      return resolve(result);
    });
  });
}

export default googleRequestAPI;
