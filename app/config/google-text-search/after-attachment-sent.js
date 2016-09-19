import callSendAPI from "../send-requests";

export default function AfterSent(recipientId) {
  const actionData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "To get close to accurate results, please add your state and/or country to your search\
      \n\nFor example: show me the great wall of china or \nshow me maryland mall at maryland lagos nigeria"
    }
  }
  setTimeout(() => {
    callSendAPI(actionData);
  },2000)
}
