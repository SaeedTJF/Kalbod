import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [userData, setUserData] = useState(null);
    const [sessionId, setSessionId] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [firstMessageSent, setFirstMessageSent] = useState(false);
    const router = useRouter();
    const { id: chatId } = router.query;

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            // console.log("Loaded User Data from localStorage:", parsedUserData);
        }
    }, []);

    useEffect(() => {
        if (firstMessageSent) {
            const timer = setTimeout(() => {
                fetchAllSessions();
                setFirstMessageSent(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [firstMessageSent]);

    const setUserDataWithLog = (data) => {
        // console.log("Setting User Data in ChatContext:", data);
        setUserData(data);
    };


    const [hasMessageBeenSent, setHasMessageBeenSent] = useState(false);
    const [typingMessage, setTypingMessage] = useState(null);

    const fetchSessionId = async () => {
        if (!userData || !userData.token) {
            console.error("User token is missing.");
            return;
        }

        try {
            const resmessageContentnse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/allSessions/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.length > 0) {
                setSessionId(data[0].id);
            }
        } catch (error) {
            console.error("Error fetching session id:", error);
        }
    };

    const fetchAllSessions = async () => {
        if (!userData || !userData.token) {
            console.error("User token is missing.");
            return;
        }

        try {
            // console.log("Fetching all sessions with headers:");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/allSessions/`, {
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSessions(data);
        } catch (error) {
            console.error("Error fetching all sessions:", error);
        }
    };

    const deleteSession = async (sessionId) => {
        if (!userData || !userData.token) {
            console.error("User token is missing.");
            return;
        }

        const serviceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/deleteSession/${sessionId}/`;

        // console.log(`Deleting session with ID ${sessionId} at ${serviceUrl}`);

        try {
            const response = await fetch(serviceUrl, {
                method: 'DELETE',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            // console.log(`Response status: ${response.status}`);
            if (response.status === 204 || response.ok) {
                // console.log(`Session with ID ${sessionId} deleted successfully`);
                setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
            } else {
                const responseText = await response.text();
                console.error(`Failed to delete session with ID ${sessionId}: ${responseText}`);
            }
        } catch (error) {
            console.error(`Error deleting session with ID ${sessionId}:`, error);
        }
    };

    const deleteHistory = async (sessionId) => {
        if (!userData || !userData.token) {
            console.error("User token is missing.");
            return;
        }

        const serviceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/deleteLlmHistory/${sessionId}/`;

        // console.log(`Deleting history with session ID ${sessionId} at ${serviceUrl}`);

        try {
            const response = await fetch(serviceUrl, {
                method: 'DELETE',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });
            // console.log(`Response status: ${response.status}`);
            if (response.status === 204 || response.ok) {
                // console.log(`History with session ID ${sessionId} deleted successfully`);
            } else {
                const responseText = await response.text();
                // console.error(`Failed to delete history with session ID ${sessionId}: ${responseText}`);
            }
        } catch (error) {
            console.error(`Error deleting history with session ID ${sessionId}:`, error);
        }
    };

                               
    

    const sendMessage = async (message, type, overrideSessionId) => {
        if (!userData || !userData.token) {
            console.error("User token is missing.");
            return;
        }
        const currentSessionId = chatId || sessionId;
        // const serviceUrl = `${process.env.next_public_base_url}/multillm/${type}/${overrideSessionId || currentSessionId}/`

        const serviceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/multillm-send/${type}/${overrideSessionId || currentSessionId}/1`;
        // console.log(`Sending message to ${serviceUrl}:`, message);

        const headers = {
            Authorization: userData.token,
            'Content-Type': 'application/json',
        };

        const data = { text: message, type: type };
        // console.log("data to server:", data);

        try {
            const response = await fetch(serviceUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            const responseData = await response.json();

            const check_chat = async () => {
                while (true) {
                    let datachat = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/multillm-get/${responseData.llm_request_id}`, { headers: headers });
                    let jsondatachat = await datachat.json();
                    if (jsondatachat.status === 'Ai_Wait') {
                        await new Promise(resolve => setTimeout(resolve, 4000));
                    } else if (jsondatachat.status === "Done") {
                        jsondatachat['chat_id'] = jsondatachat.data.payload.chat_id
                        // console.log(" jsondatachat " , jsondatachat)
                        return jsondatachat;
                    }
                    else if (jsondatachat.status === "Dont_Use_Mq") {
                        jsondatachat['chat_id'] = jsondatachat.data.payload.chat_id
                        return jsondatachat;
                    }

                    else if (jsondatachat.status === "ERROR") {
                        return "{\"en\": \"We apologize for the inconvenience. Due to network issues, the system is unable to respond. Please contact the support team. \",  \"fa\": \"با عرض پوزش به علت مشکلات شبکه سیستم قادر به پاسخگویی نمی باشد . لطفا با تیم پشتیبانی تماس حاصل فرمایید .\", \"session_id\": \"0\", \"type\": \"AI\", \"result_Id\": 1}"

                    }
                    else {
                        return "{\"en\": \"We apologize for the inconvenience. Due to network issues, the system is unable to respond. Please contact the support team. \",  \"fa\": \"با عرض پوزش به علت مشکلات شبکه سیستم قادر به پاسخگویی نمی باشد . لطفا با تیم پشتیبانی تماس حاصل فرمایید .\", \"session_id\": \"0\", \"type\": \"AI\", \"result_Id\": 1}"


                    }
                }
            };

            let checker = await check_chat();
            console.log(" 22 " , checker)
            let responsedata = JSON.parse(checker.data.response)
            responsedata['chat_id'] = checker.chat_id
            responsedata['response_language'] =  checker.response_language || "NO-TRANSLATE";
            responsedata = JSON.stringify(responsedata)
            return responsedata;
        } catch (error) {
            console.error("Error sending message:", error);
            return "{\"en\": \"We apologize for the inconvenience. Due to network issues, the system is unable to respond. Please contact the support team. \",  \"fa\": \"با عرض پوزش به علت مشکلات شبکه سیستم قادر به پاسخگویی نمی باشد . لطفا با تیم پشتیبانی تماس حاصل فرمایید .\", \"session_id\": \"0\", \"type\": \"AI\", \"result_Id\": 1}"
        }
    };


    const resetState = () => {
        setMessages([]);
        setUserData(null);
    };

    const resetDashboard = () => {
        setMessages([]);
        setSessionId(0);
        setHasMessageBeenSent(false);
    };
    const addMessage = async (message, type, overrideSessionId = null, contentType = 'text') => {
        const newMessage = { text: message, type: type, contentType: contentType, isSystemMessage: false };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        setHasMessageBeenSent(true);

        const loadingMessage = { text: '', type: 'loader', contentType: 'text', isSystemMessage: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        const replyData = await sendMessage(message, type, overrideSessionId);

        setMessages(prevMessages => prevMessages.filter(msg => msg !== loadingMessage));

        if (replyData) {
            let replyMessage;
            // if (type === '9') {
            //     replyMessage = {
            //         text: replyData,
            //         type: 'answer',
            //         contentType: 'html',
            //         isSystemMessage: true,
            //         showEnglish: true,
            //         isTypingCompleted: false,
            //         result_Id: replyData.result_Id
            //     };
            // } else {
            const parsedReply = JSON.parse(replyData);
           
            replyMessage = {
                text: parsedReply,
                type: 'AI',
                contentType: parsedReply.type,
                isSystemMessage: true,
                showEnglish: true,
                isTypingCompleted: false,
                result_Id: parseInt(parsedReply.chat_id)+1
            };
            setSessionId(parsedReply.session_id);
            // }
            setMessages(prevMessages => [...prevMessages, replyMessage]);

            if (!firstMessageSent) {
                setFirstMessageSent(true);
            }
        } else if (type === 'search') {
            const errorMessage = {
                text: { en: "The search service is currently unavailable.", fa: "سرویس پرس و جو در دسترس نیست." },
                type: 'AI',
                contentType: 'text',
                isSystemMessage: true,
                showEnglish: true,
                isTypingCompleted: false
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
    };



    const rateChat = async (resultId, rating) => {
        if (!userData || !userData.token) {
            console.error("User token is missing.");
            return;
        }

        const serviceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/rateChat/${resultId}/${rating}/`;

        try {
            const response = await fetch(serviceUrl, {
                method: 'POST',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // console.log(`Rating ${rating} for resultId ${resultId} sent successfully`);
            } else {
                console.error(`Failed to send rating ${rating} for resultId ${resultId}:`, response.status);
            }
        } catch (error) {
            console.error(`Error sending rating ${rating} for resultId ${resultId}:`, error);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, setMessages, addMessage, hasMessageBeenSent, setHasMessageBeenSent, resetState, resetDashboard, userData, setUserData: setUserDataWithLog, fetchAllSessions, sessions, deleteSession, deleteHistory, rateChat }}>
            {children}
        </ChatContext.Provider>
    );
};
