import axios from "axios";

export default async function Products() {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.uber.com/v1/estimates/price",
      params: {
        server_token: process.env.UBER_SERVER_TOKEN,
        latitude: 37.775818,
        longitude: -122.418028,
      }
    });
    console.log(response.data)
  } catch (e) {
    console.trace(e, "error occured on Uber products");
  }
}
