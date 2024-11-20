import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);


export const ChatProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const resetState = () => {
        setMessages([]);
    };
    const [hasMessageBeenSent, setHasMessageBeenSent] = useState(false);
    const [typingMessage, setTypingMessage] = useState(null);
    const systemReplies = {
        chat: {
            "سلام": ['سلام', 'من','یک','کمک','دستیار','آموزشی','از','سامانه','هوشمند','خاتم','هستم','چطور','میتونم','کمکتون','کنم؟'],
            "چطوری؟": "خوبم، متشکرم. شما چطورید؟",
            "کد": "کد شما به صورت زیر است:\n```python\nprint('Hello, World!')\n```",
            "با پایتون برام بنویس سلام": "کد شما به به صورت زیر است<code>python print('Hello, World!')</code>"
        },
        search: {
            "سلام": ['my', 'name', 'is', 'sepehr']
        }
    };


    const addMessage = (message, type, contentType = 'text') => {
        const newMessage = { text: message, type: type, contentType: contentType, isSystemMessage: false };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        let replyText = systemReplies[type][message.trim()];
        if (replyText) {
            if (Array.isArray(replyText)) {
                replyText = replyText.join(' ');
            }
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                const replyMessage = { text: replyText, type: type, contentType: 'text', isSystemMessage: true };
                setMessages(prevMessages => [...prevMessages, replyMessage]);
            }, 1000);
        }

        setHasMessageBeenSent(true);
    };







    return (
        <ChatContext.Provider value={{ messages, setMessages, addMessage, hasMessageBeenSent, setHasMessageBeenSent, isLoading, resetState  }}>
            {children}
        </ChatContext.Provider>
    );
};
