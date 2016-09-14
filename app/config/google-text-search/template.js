import callSendAPI from "../send-requests";
import { map, get } from "lodash";


async function configElements(data) {
  let el = [];
  map(data, (value) => {

    let subFomat = get(value, "opening_hours.open") ? value.opening_hours.open : "they seem to have closed, but i can't guarantee 100%";
    el.push({
      title: value.name,
      image_url: value.image,
      subtitle: value.formatted_address + " \nOpen: " + subFomat,
      buttons: [{
        type: "element_share"
      }]
    })
  });
  return el;
}

async function sendTextSearch(searchResults, recipientId) {
  try {
    console.log(searchResults, "===============")
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
    console.log(elementParts)
    callSendAPI(actionData);
  } catch(e) {
    console.log(e, "error generating temp buttons");
  }
}

export default sendTextSearch;
