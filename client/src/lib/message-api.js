import api from "./axios";

export const sendMessage = async (message) => {
  const response = await api.post("/messages/send-message", message);
  return response.data;
};

export const getConversation = async (conversationId) => {
  const response = await api.get(
    `/messages/get-conversation/${conversationId}`,
  );
  return response.data;
};
