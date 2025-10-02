import { useState, useEffect } from 'react';
import { getMessages, getQueryResponses, subscribe } from '../store/chatStore';

export const useChatMessages = () => {
  const [messages, setMessages] = useState(() => getMessages());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      // Force a new array reference to trigger re-render
      setMessages([...getMessages()]);
    });
    return unsubscribe;
  }, []);

  return messages;
};

export const useQueryResponses = () => {
  const [responses, setResponses] = useState(() => getQueryResponses());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      // Force a new array reference to trigger re-render
      setResponses([...getQueryResponses()]);
    });
    return unsubscribe;
  }, []);

  return responses;
};