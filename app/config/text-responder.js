import sendMessage from "./send-message";
import helpText from "../util/helper-text";
import textSearch from "./search";
import genericResponse from "../util/generic-response-text";
import keywords from "../util/keywords";
import sendTextSeachResult from "./google-text-search/template";

async function listener(text, recipientId) {
  destructureText(text).then(response => {
    if (response) {
      sendTextSeachResult(response, recipientId);
    } else {
      sendMessage(recipientId, `
            Arggh sadly your search returned no results \n\nWhat if you try your search and you add your state/country? after? \n\nFor Example: \nshow me party clubs newyork \nor \nshow me shaunz bar lagos`);
    }
  });
}

// listener("map on restaurants in yaba nigeria");
function getFirstTwoKeywords(text) {
  let newText = text.split(" ");
  let checkKeyword = newText.splice(0, 2).join(" ");
  return {checkKeyword, newText};
}
async function destructureText(text) {
  let {checkKeyword, newText} = getFirstTwoKeywords(text);
  let searchTerm = newText.join(" ");
  return await composeText(checkKeyword, searchTerm);
}

async function composeText(keyword, searchTerm) {
  switch (keyword) {
    case "show me":
      return await textSearch(searchTerm, "photo");
      break;
    case "map on":
      return await textSearch(searchTerm, "map");
      break;
    default:
      return "Sorry command not recognized, please check page";
      break;
  }
}

async function sendTextMessage(recipientId, messageText, postback) {
  messageText = messageText.toLowerCase();
  if (recipientId) {
    if (postback === "help") {
      return sendMessage(recipientId, messageText);
    } else if (genericResponse.greetings.includes(messageText)) {
      return sendMessage(recipientId, `Hi There!\nHow may i help you 🎩?`);
    } else if (genericResponse.byes.includes(messageText)) {
      return sendMessage(recipientId, `Alright! Thank you, bye now 🙏`);
    } else {
      let {checkKeyword} = getFirstTwoKeywords(messageText)
      console.log(checkKeyword, "checkKeyword");
      if (keywords.includes(checkKeyword)) {
        return listener(messageText, recipientId);
      } else {
        sendMessage(recipientId, "Sorry command not recognized, please check page");
      }
    }
  }
}

export default sendTextMessage;
