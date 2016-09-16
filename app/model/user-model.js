import mongoose from "mongoose";
const Schema = mongoose.Schema;


const User = new Schema({
  name: { type: String, index: true },
  gender: {type: String, index: true},
  locale: {type: String, index: true},
  timezone: {type: String, index: true},
  location: Object.assign({}, {
    latitude: String,
    longitude: String,
    title: String
  })
});

export default mongoose.model("User", User);
