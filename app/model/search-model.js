import mongoose from "mongoose";
const Schema = mongoose.Schema;


const TextPlace = new Schema({
  name: { type: String, index: true },
  image_url: {type: String, index: true},
  map_url: {type: String, index: true}
});

export default mongoose.model("TextPlace", TextPlace);
