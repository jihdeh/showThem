import callSendAPI from "./send-requests";
import helpText from "../util/helper-text";
import textSearch from "./google-text-search";
import genericResponse from "../util/generic-response-text";
import keywords from "../util/keywords";
import sendTextSeachResult from "./google-text-search/template";

let valid;
async function listener(text, recipientId) {
  console.log(text, valid);
  if (valid) {
    destructureText(text).then(response => {
      sendTextSeachResult(response, recipientId);
    });
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
  switch (keyword) {
    case "show me":
      valid = true;
      return await textSearch(searchTerm);
      break;
    default:
      valid = false;
      return "Sorry command is incorrect, please check";
      break;
  }
}

async function sendTextMessage(recipientId, messageText, postback) {
  let response;
  messageText = messageText.toLowerCase();
  if (postback === "help") {
    response = messageText;
  } else if (genericResponse.greetings.includes(messageText)) {
    response = `Hi There!\nHow may i help you 🎩?`;
  } else if (genericResponse.byes.includes(messageText)) {
    response = `Alright! Thank you, bye now 🙏`;
  } else {
    return listener(messageText, recipientId);
  }
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: response
    }
  };
  try {
    callSendAPI(messageData);
  } catch (error) {
    console.log("An error occured");
  }
}

export default sendTextMessage;
