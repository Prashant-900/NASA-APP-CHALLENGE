// Global chat store
let chatStore = {
  messages: [],
  queryResponses: [],
  messageIdCounter: 0,
  queryIdCounter: 0,
  listeners: []
};

export const addMessage = (message) => {
  chatStore.messages.push(message);
  notifyListeners();
};

export const updateMessage = (id, updates) => {
  const index = chatStore.messages.findIndex(msg => msg.id === id);
  if (index !== -1) {
    chatStore.messages[index] = { ...chatStore.messages[index], ...updates };
    notifyListeners();
  }
};

export const addQueryResponse = (response) => {
  const queryResponse = {
    ...response,
    queryId: response.messageId,
    timestamp: new Date().toLocaleString()
  };
  chatStore.queryResponses.push(queryResponse);
  notifyListeners();
  return queryResponse.queryId;
};

export const getNextMessageId = () => {
  return chatStore.messageIdCounter++;
};

export const getMessages = () => chatStore.messages;
export const getQueryResponses = () => chatStore.queryResponses;

export const subscribe = (listener) => {
  chatStore.listeners.push(listener);
  return () => {
    chatStore.listeners = chatStore.listeners.filter(l => l !== listener);
  };
};

const notifyListeners = () => {
  chatStore.listeners.forEach(listener => listener());
};