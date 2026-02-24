import api from "./axios";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const getUserConversations = async () => {
    const response = await api.get("/messages/get-user-conversations");
    return response.data;
};

export const getConversationMessages = async (conversationId) => {
    const response = await api.get(`/messages/get-conversation/${conversationId}`);
    return response.data;
};

export const sendMessageApi = async (data) => {
    const response = await api.post("/messages/send-message", data);
    return response.data;
};

export const markAsReadApi = async (conversationId) => {
    const response = await api.patch(`/messages/mark-as-read/${conversationId}`);
    return response.data;
};

export const updateProfileApi = async (data) => {
    const response = await api.patch("/users/me", data);
    return response.data;
};
