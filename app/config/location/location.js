import callSendAPI from "../send-requests";

export default function Location(recipientId) {
  const actionData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Please share your location:",
      quick_replies: [{
        content_type: "location",
      }]
    }
  }
  callSendAPI(actionData);
}
