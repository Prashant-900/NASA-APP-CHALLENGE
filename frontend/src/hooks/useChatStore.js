import { useState, useEffect } from 'react';
import { getMessages, getQueryResponses, subscribe } from '../store/chatStore';

export const useChatMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setMessages(getMessages());
    });
    setMessages(getMessages());
    return unsubscribe;
  }, []);

  return messages;
};

export const useQueryResponses = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setResponses(getQueryResponses());
    });
    setResponses(getQueryResponses());
    return unsubscribe;
  }, []);

  return responses;
};