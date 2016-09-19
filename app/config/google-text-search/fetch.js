import axios from "axios";
import { mapSeries } from "async";
import {get } from "lodash";
import cloudinary from "../../../util/cloudinary-config";
import SearchModel from "../../model/search-model";

export default async function getRequestImages(candidates) {
  return new Promise(resolve => {
    mapSeries(candidates, async(result, cb) => {
      try {
        const findImage = await SearchModel.find({ name: result.name }).lean();
        const photoReference = get(result, "photos.[0].photo_reference");
        if (get(findImage, "[0]")) {
          result = Object.assign({},
            result, {
              image_url: get(findImage, "[0].image_url") || result.icon,
              item_url: get(findImage, "[0].image_url")
            });
        } else if (photoReference !== undefined && get(findImage, "[0]") === undefined) {
          try {
            const res = await axios({
              url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_API_KEY}`,
              method: "get",
              responseType: "arraybuffer"
            });
            const data = "data:" + res.headers["content-type"] + ";base64," + new Buffer(res.data).toString('base64');
            const cloudResponse = await cloudinary.v2.uploader.upload(data, { public_id: result.id });
            result = Object.assign({},
              result, {
                image_url: cloudResponse.secure_url,
                item_url: cloudResponse.secure_url
              });
            const saveTextSearchImageUrl = new SearchModel();
            saveTextSearchImageUrl.name = result.name;
            saveTextSearchImageUrl.image_url = result.image_url;
            saveTextSearchImageUrl.save();
          } catch (error) {
            console.trace("Error occured getting photo references", error);
          }
        } else {
          result = Object.assign({}, result, { image_url: result.icon });
        }
        cb(null, result);
      } catch (e) {
        console.log(e);
      }
    }, (err, result) => {
      console.log(result);
      if (err) {
        console.log("error getting google images result", err);
        return;
      }
      return resolve(result);
    });
  });
}
