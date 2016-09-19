import callSendAPI from "../send-requests";
import { map, get } from "lodash";


async function configElements(data) {
  let el = [];
  map(data, (value) => {

    let subFomat = get(value, "opening_hours.open_now") ? (value.opening_hours.open_now) ? "Yes" : "" : "I'm unsure";
    el.push({
      title: value.name,
      image_url: get(value, "image_url") || get(value, "map_url"),
      item_url: value.item_url,
      subtitle: value.formatted_address + " \n, Open: " + subFomat,
      buttons: [{
        type: "element_share"
      }]
    });
  });
  return el;
}

async function sendTextSearch(searchResults, recipientId) {
  try {
    const elementParts = await configElements(searchResults);
    const actionData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elementParts
          }
        }
      }
    }
    callSendAPI(actionData);
  } catch(e) {
    console.log(e, "error generating temp buttons");
  }
}

export default sendTextSearch;
