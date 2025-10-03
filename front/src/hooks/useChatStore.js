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
      const newResponses = getQueryResponses();
      console.log('🔄 Query responses updated:', {
        count: newResponses.length,
        responses: newResponses.map(r => ({
          queryId: r.queryId,
          hasData: !!r.data,
          hasPlot: !!r.plot,
          plotLength: r.plot ? r.plot.length : 0
        }))
      });
      // Force a new array reference to trigger re-render
      setResponses([...newResponses]);
    });
    return unsubscribe;
  }, []);

  return responses;
};