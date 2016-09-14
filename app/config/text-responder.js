import callSendAPI from "./send-requests";
import helpText from "../util/helper-text";
import textSearch from "./google-text-search";
import genericResponse from "../util/generic-response-text";
import keywords from "../util/keywords";
import sendTextSeachResult from "./google-text-search/template";

async function listener(text, recipientId) {
  console.log(text);
  if (keywords.show.includes(text)) {
    destructureText(text).then(response => {
      sendTextSeachResult(response, recipientId);
    });
  } else {
    return sendMessage(recipientId, `Sorry command is incorrect, please check page`);
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
      return await textSearch(searchTerm);
      break;
    default:
      return "Sorry command is incorrect, please check page";
      break;
  }
}

function sendMessage(recipientId, response) {
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

async function sendTextMessage(recipientId, messageText, postback) {
  messageText = messageText.toLowerCase();
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

export default sendTextMessage;
