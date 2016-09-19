import callSendAPI from "../send-requests";

export default function AfterSent(recipientId) {
  const actionData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "To get close to accurate results, please add your state and/or country to your search\
      \nFor example: show me the great wall of china or \n show me maryland mall at maryland lagos nigeria"
    }
  }
  callSendAPI(actionData);
}
