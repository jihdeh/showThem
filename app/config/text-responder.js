import sendMessage from "./send-message";
import helpText from "../util/helper-text";
import textSearch from "./google-text-search";
import genericResponse from "../util/generic-response-text";
import keywords from "../util/keywords";
import sendTextSeachResult from "./google-text-search/template";

async function listener(text, recipientId) {
  if (recipientId) {
    if (/[keywords.show]/i.test(text)) {
      destructureText(text).then(response => {
        console.log(response)
        if(response) {
          sendTextSeachResult(response, recipientId);
        } else {
          sendMessage(recipientId, `
            Arggh sadly your search returned no results \n
            What if you try your search and you add your state/country? after? \n
            For Example: show me party clubs newyork or show me shaunz bar lagos`);
        }
      });
    } else {
      return sendMessage(recipientId, `Sorry command on show is incorrect, please check page`);
    }
  }
}

// listener("show me restaurants in yaba nigeria");

async function destructureText(text) {
  let newText = text.split(" ");
  let checkKeyword = newText.splice(0, 2).join(" ");
  let searchTerm = newText.join(" ");
  return await compose(checkKeyword, searchTerm);
}

async function compose(keyword, searchTerm) {
  console.log(keyword, "word")
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
      return listener(messageText, recipientId);
    }
  }
}

export default sendTextMessage;
