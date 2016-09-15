import sendMessage from "./send-message";
import helpText from "../util/helper-text";
import textSearch from "./google-text-search";
import genericResponse from "../util/generic-response-text";
import keywords from "../util/keywords";
import sendTextSeachResult from "./google-text-search/template";

async function listener(text, recipientId) {
  destructureText(text).then(response => {
    console.log(response)
    if (response) {
      sendTextSeachResult(response, recipientId);
    } else {
      sendMessage(recipientId, `
            Arggh sadly your search returned no results \n\nWhat if you try your search and you add your state/country? after? \n\nFor Example: \nshow me party clubs newyork \nor \nshow me shaunz bar lagos`);
    }
  });
}

console.log(/shw me/i.test("show me restaurants in yaba nigeria"))

// listener("show me restaurants in yaba nigeria");

async function destructureText(text) {
  let newText = text.split(" ");
  let checkKeyword = newText.splice(0, 2).join(" ");
  let searchTerm = newText.join(" ");
  return await composeText(checkKeyword, searchTerm);
}

async function composeText(keyword, searchTerm) {
  switch (keyword) {
    case "show me":
      return await textSearch(searchTerm);
      break;
    default:
      return "Sorry command on default is incorrect, please check page";
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
      console.log(/[messageText]/i.test("show me restaurants in yaba nigeria"), "test vars")
      if (/[keywords.show]/i.test(messageText)) {
        return listener(messageText, recipientId);
      } else {
        return sendMessage(recipientId, `Sorry command on show is incorrect, please check page`);
      }
    }
  }
}

export default sendTextMessage;
