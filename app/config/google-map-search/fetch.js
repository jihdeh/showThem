import axios from "axios";
import { mapSeries } from "async";
import {get } from "lodash";
import cloudinary from "../../../util/cloudinary-config";
import SearchModel from "../../model/search-model";

export default async function getRequestImages(candidates) {
  return new Promise(resolve => {
    mapSeries(candidates, async(result, cb) => {
      try {
        const findImage = await SearchModel.find({ name: result.name, map_url: { $exists: true } }).lean();
        const latitudeReference = get(result, "geometry.location.lat");
        const longitudeReference = get(result, "geometry.location.lng");
        if (get(findImage, "[0]")) {
          result = Object.assign({},
            result, {
              map_url: get(findImage, "[0].map_url"),
              item_url: get(findImage, "[0].map_url")
            });
        } else if (latitudeReference !== undefined && longitudeReference !== undefined && get(findImage, "[0]") === undefined) {
          try {
            const res = await axios({
              url: "https://maps.googleapis.com/maps/api/staticmap",
              method: "get",
              params: {
                key: process.env.GOOGLE_API_KEY,
                zoom: 16,
                size: "600x400",
                maptype: "roadmap",
                markers: decodeURIComponent("color:red%7Clabel:S%7C") + `${latitudeReference}` + "," + `${longitudeReference}`
              },
              responseType: "arraybuffer"
            });
            const data = "data:" + res.headers["content-type"] + ";base64," + new Buffer(res.data).toString('base64');
            const cloudResponse = await cloudinary.v2.uploader.upload(data, { public_id: result.id });
            result = Object.assign({},
              result, {
                map_url: cloudResponse.secure_url,
                item_url: cloudResponse.secure_url
              });
            //but incase the name exists
            const findImageifExists = await SearchModel.find({ name: result.name }).lean();
            console.log(findImageifExists)
            if (findImageifExists.length > 0) {
              try {
                await SearchModel.update({ name: result.name }, { map_url: result.map_url });
              } catch (e) {
                console.trace("error updating field", e)
              }
            } else {
              const findImageifExists = new SearchModel();
              findImageifExists.name = result.name;
              findImageifExists.map_url = result.map_url;
              findImageifExists.save();
            }
          } catch (error) {
            console.trace("Error occured getting photo references", error);
          }
        } else {
          result = Object.assign({}, result, { map_url: result.icon });
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
