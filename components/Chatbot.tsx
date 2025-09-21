
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { ChatIcon } from './icons/ChatIcon';

interface ChatbotProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ history, onSendMessage, isSending }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSending) {
      handleSend();
    }
  };
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
        aria-label="Open Chat"
      >
        <ChatIcon className="w-8 h-8" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-0 right-0 mb-6 mr-6 w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col h-[60vh]">
       <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-700/50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-white">Document Assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isSending && (
             <div className="flex items-end justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-700 text-gray-200 rounded-bl-none flex items-center space-x-2">
                    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.1s]"></span>
                    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.3s]"></span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the document..."
            className="w-full bg-transparent px-4 py-2 text-gray-200 focus:outline-none"
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="p-2 text-white rounded-full m-1 transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
