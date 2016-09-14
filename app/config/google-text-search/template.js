import callSendAPI from "../send-requests";
import { map, get } from "lodash";


async function configElements(data) {
  let el = [];
  map(data, (value) => {

    let subFomat = get(value, "opening_hours.open_now") ? value.opening_hours.open_now : "they seem to have closed, but i can't guarantee 100%";
    el.push({
      title: value.name,
      image_url: value.image_url,
      subtitle: value.formatted_address + " \n, Open?: " + subFomat,
      buttons: [{
        type: "element_share"
      }]
    })
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
