import callSendAPI from "./send-requests";
import helpText from "../util/helper-text";

async function listener(text) {
  return text;
}

async function sendTextMessage(recipientId, messageText, postback) {
  let response;
  messageText = messageText.toLowerCase();
  if (postback === "help") {
    response = messageText
  } else if (messageText === "help" || messageText === "hi" || messageText === "hello") {
    response = helpText;
  } else {
    response = await listener(messageText);
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
