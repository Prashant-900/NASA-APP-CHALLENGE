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
    // Create a new array to ensure React detects the change
    chatStore.messages = [
      ...chatStore.messages.slice(0, index),
      { ...chatStore.messages[index], ...updates },
      ...chatStore.messages.slice(index + 1)
    ];
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
  // Use setTimeout to ensure state updates are batched properly
  setTimeout(() => {
    chatStore.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in chat store listener:', error);
      }
    });
  }, 0);
};