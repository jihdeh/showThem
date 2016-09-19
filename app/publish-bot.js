import welcomeGreeting from "./config/welcome-greeting";
import sendActions from "./config/sender-actions";
import sendTextMessage from "./config/text-responder";
import {get} from "lodash";

function* webhook() {
  const data = this.request.body;

  if (data.object == "page") {
    welcomeGreeting();

    data.entry.forEach(function(pageEntry) {
      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
    this.status = 200;
  }
}


async function receivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));


  // You may get a text or attachment but not both
  const messageText = message.text;
  const messageAttachments = message.attachments;
  console.log(message);
  if (messageText & !get(JSON.stringify(message), "is_echo")) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      default: 
      try {
        await sendActions(senderID);
      } catch (error) {
        console.log(error)
      }
      sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    console.log("message attachment received", messageAttachments);
    // sendTextMessage(senderID, "Message with attachment received");
  }
}

function receivedDeliveryConfirmation(event) {
  const delivery = event.delivery;
  const messageIDs = delivery.mids;
  const watermark = delivery.watermark;

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      console.log("Received delivery confirmation for message ID: %s",
        messageID);
    });
  }
  console.log("All message before %d were delivered.", watermark);
}

function receivedPostback(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfPostback = event.timestamp;
  const payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);
  switch(payload) {
    case "PAYLOAD_GETTING_STARTED":
      sendTextMessage(senderID, "help");
      break;
    case "PAYLOAD_LOCATION":
      sendTextMessage(senderID, "my location");
      break;
    default: 
      sendTextMessage(senderID, "help");
      break;
  }
}


export default { webhook };
