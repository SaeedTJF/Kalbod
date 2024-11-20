

import React, { useState, useEffect, useRef } from "react";
import { Rating } from "react-simple-star-rating";
import { IconStar } from "@/components/Icons/iconStar";

import Image from "next/image";
import style from './ChatConversation.module.css';
import { useChat } from '@/contexts/ChatContext';
import { IconLoaderAnimated } from "@/components/Icons/iconLoaderAnimated";
import { IconTrash } from "@/components/Icons/iconTrash";
import KhatamTypeWriter from "@/components/TypeWriter/TypeWriter";
import { useRouter } from "next/router";
import { IconDown } from "@/components/Icons/iconDown";
import 'prismjs/themes/prism-okaidia.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconStarFill } from "@/components/Icons/iconStarFill";

const markdownToHtml = (markdown) => {
    if (typeof markdown !== 'string') {
        markdown = String(markdown);
    }

    const container = document.getElementById('chatWrapRef');
    container.scrollTop = container.scrollHeight;

    // Regular expression for both Python and Java code blocks
    const codeBlockRegex = /```(python|java)([\s\S]*?)```/g;

    // Replacing code blocks with highlighted HTML
    const htmlContent = markdown.replace(codeBlockRegex, (match, language, code, index) => {
        container.scrollTop = container.scrollHeight;

        // Determine the language for syntax highlighting
        let highlightedCode;
        if (language === 'python') {
            highlightedCode = Prism.highlight(code, Prism.languages.python, 'python');
        } else {
            highlightedCode = Prism.highlight(code, Prism.languages.java, 'java');
        }

        return `
        <div style="position:relative;">
        <button class="copy-button" data-id="code-${index}">Copy</button>
            <pre class="language-${language}" style="display:flex;">
                
                <code id="code-${index}">${highlightedCode}</code>
            </pre>
        </div>`;
    });

    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        document.querySelectorAll('.copy-button').forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', () => {
                const codeId = newButton.getAttribute('data-id');
                const codeElement = document.getElementById(codeId);
                const range = document.createRange();
                range.selectNodeContents(codeElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                try {
                    document.execCommand('copy');
                    toast.success('Code copied to clipboard!');
                } catch (err) {
                    toast.error('Failed to copy code!');
                }

                selection.removeAllRanges();
            });
        });
    }, 0);

    // Replace Markdown bold text (**) with HTML <h1> tags
    const finalHtmlContent = htmlContent.replace(/\*\*(.+?)\*\*/g, (match, p1) => {
        return `<h1>${p1}</h1>`;
    });

    // Additional replacements (for example, handling asterisks)
    const finalHtmlContentav = finalHtmlContent.replace(/\*/g, "<br>*");

    return finalHtmlContentav;
};





export default function ChatConversationHistory({ isChosen, setIsChosen }) {
    const { messages, hasMessageBeenSent, resetState, userData, setMessages, sessionId, addMessage, deleteHistory, rateChat } = useChat();
    const [rating, setRating] = useState(0);
    const [oldChat, setOldChat] = useState([]);
    const [countdown, setCountdown] = useState(0);
    const [chatLoaded, setChatLoaded] = useState(false);
    const router = useRouter();
    const chatEndRef = useRef(null);
    const [userprofile, setuserprofile] = useState(null);
    const chatWrapRef = useRef(null);
    const messagesEndRef = useRef(null)
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [sc, setsc] = useState(true)
    const [checklang, setchecklang] = useState(null);
    const [llmname, setllmname] = useState(null)
    const [icon, seticon] = useState(null)
    const [isStartTranslate, setIsStartTranslate] = useState(false)
    const [statusTranslateSevice, setStatusTranslateSevice] = useState(true);
    const [responseLang, setResponseLang] = useState(true);
    const [resplang, setresplang] = useState(null)

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setShowScrollButton(false); // پنهان کردن دکمه پس از اسکرول به پایین
    };

    const handleScroll = () => {
        if (chatWrapRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatWrapRef.current;
            if (scrollTop + clientHeight < scrollHeight - 10) { // اگر کاربر به سمت بالا اسکرول کرد
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages[messages.length - 1]?.isTypingCompleted]);

    const runscroll = (e) => {
        while (sc) {
            setTimeout(() => {
                const container = document.getElementById('chatWrapRef');
                container.scrollTop = container.scrollHeight;
            }, 300)
            if (sc == false) {
                break
            }
        }
    }





    const fetchChat = async () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/getChat/${router.query.id}/`;
        const response = await fetch(url, {
            headers: { 'Authorization': `${userData.token}` }
        });

        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return; // می‌توانید در اینجا از تابع خارج شوید
        }

        const data = await response.json();
        let selectheadside = document.getElementById('selectheadside');
        selectheadside.disabled = true;

        setchecklang(data[0].session['llm'].language);
        setIsChosen(data[0].session['llm'].id);
        setresplang(data[0].response_language)
        console.log(" data[0].session['llm'].id) ", data)
        console.log(" data[0].session['llm'].id) ", data[0].session['llm'].id)
        console.log(" data[0].session['llm'].id) ", data[0].session['llm'].name)

        setllmname(data[0].session['llm'].name);
        seticon(data[0].session['llm'].icon);

        const updatedMessages = [];
        for (const [index, msg] of data.entries()) {
            if (msg.response_language === "NO-TRANSLATE") {
                setResponseLang(false)
            }
            else {
                setResponseLang(msg.response_language);

            }
            // console.log(" msg", msg);
            let parsedContent = null;

            if (msg.side === 'AI' || msg.side === 'answer') {
                try {
                    parsedContent = JSON.parse(msg.textbox);
                } catch (e) {
                    console.error("Error parsing textbox content:", e);
                }
            }

            let isEnglish = false;
            let temp_translate_fa = false;
            let temp_translate_en = false;
            try {
                if (msg.response_language === "NO-TRANSLATE") {
                    isEnglish = !!parsedContent.en;
                } else if (msg.response_language === "EN" && !('en' in parsedContent) && 'fa' in parsedContent) {


                    temp_translate_en = await just_translate_to_en(parsedContent.fa, msg.id);
                    console.log(" JUST en tr ")
                    // console.log(temp_translate_en)
                    if (temp_translate_en) {
                        parsedContent["en"] =temp_translate_en
                            isEnglish = true;

                    }

                } else if (msg.response_language === "FA" && !('fa' in parsedContent) && 'en' in parsedContent) {
                    temp_translate_fa = await just_translate_to_fa(parsedContent.en, msg.id);
                    console.log(" JUST fa tr ")
                    if (temp_translate_fa) {
                        parsedContent["fa"] = temp_translate_fa
                        isEnglish = false;
                    }
                } else {
                    isEnglish = !!parsedContent.en;
                }
            } catch (error) {
                // console.error("Translation error:", error);
                isEnglish = true; // به صورت پیش‌فرض
            }

            updatedMessages.push({
                ...msg,
                parsedContent,
                isEnglish,
                id: index,
                chatId: msg.id,
                rating: msg.rating,
            });
        }

        setOldChat(updatedMessages);
        console.log(" updatedMessages ", updatedMessages)
        setChatLoaded(true);
        setTimeout(scrollToBottom, 100);
    };


    useEffect(() => {
        const fetchData = async () => {
            if (router.isReady && router.query.id && userData) {
                if (!chatLoaded || sessionId !== router.query.id) {
                    await fetchChat();
                }
            }
        };
        fetchData();
    }, [router.isReady, router.query.id, userData]);




    useEffect(() => {
        if (hasMessageBeenSent) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, hasMessageBeenSent]);

    const handleRating = (rate, resultId) => {
        setRating(rate);
        if (resultId) {
            rateChat(resultId, rate);
        } else {
            console.error("resultId is missing");
        }
    };
    const onPointerEnter = () => console.log('Enter');
    const onPointerLeave = () => console.log('Leave');
    const onPointerMove = (value, index) => console.log(value, index);



    const toggleLanguageStatus = (id) => {
        setOldChat(prevChat =>
            prevChat.map(msg =>
                msg.id === id ? { ...msg, isEnglish: !msg.isEnglish } : msg
            )
        );
    };

    useEffect(() => {
        const translateMessage = async () => {
            if (messages.length >= 1) {
                const lastItems = messages[messages.length - 1];

                if (!lastItems.text.response_language) {
                    return
                }
                if (lastItems.text.response_language === "NO-TRANSLATE") {
                    console.log(" No Translate ------------ ")
                    setResponseLang(false)
                    return
                }
                console.log(" No Translate  ", lastItems.text.response_language)

                setResponseLang(lastItems.text.response_language)

                if (lastItems.type === "AI" && !isStartTranslate && !lastItems.translated) {
                    let t;
                    if ('en' in lastItems.text) {
                        console.log("START !!");
                        t = await translate_tofaMessage(lastItems.text.en, lastItems.text.chat_id, lastItems);
                    } else if ('fa' in lastItems.text) {
                        console.log("START !! 222");
                        t = await translate_toenMessage(lastItems.text.fa, lastItems.text.chat_id, lastItems);
                    } else {
                        console.log("NONE !");
                    }
                }
            }
        };

        translateMessage();
    }, [messages]);

    const translate_toenMessage = async (text, chat_id, lastItems) => {
        if (!statusTranslateSevice) {
            console.log(" ERR ")
            return false
        }

        setIsStartTranslate(true);
        console.log("to en");

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translate-toen/${chat_id}`, {
                method: 'POST',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                }),
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                console.log("Error:", errorText);
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }

            const dataresp = await resp.json();
            if (dataresp.text === "Error!" || dataresp.text === "ترجمه نشده") {
                alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
                setStatusTranslateSevice(false)
                setIsStartTranslate(false);
                return
            }

            console.log("resp", dataresp.text);

            const updatedMessages = [...messages];
            updatedMessages[updatedMessages.length - 1] = {
                ...lastItems,
                text: {
                    ...lastItems.text,
                    en: dataresp.text,
                },
                translated: true,
            };

            setMessages(updatedMessages);
            return dataresp.text;

        } catch (error) {
            console.log("Error in translate_toen:", error);
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
            setStatusTranslateSevice(false)
        } finally {
            setIsStartTranslate(false);
        }
    };

    const translate_tofaMessage = async (text, chat_id, lastItems) => {
        if (!statusTranslateSevice) {
            console.log(" ERR ")
            return false
        }

        setIsStartTranslate(true);
        console.log("to fa");

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translate-tofa/${chat_id}`, {
                method: 'POST',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                }),
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                console.log("Error:", errorText);
                // alert("ترجمه نا موفق بود")
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }

            const dataresp = await resp.json();
            if (dataresp.text === "Error!" || dataresp.text === "ترجمه نشده") {
                alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
                setStatusTranslateSevice(false)
                setIsStartTranslate(false);
                return
            }
            console.log("resp", dataresp.text);

            const updatedMessages = [...messages];
            updatedMessages[updatedMessages.length - 1] = {
                ...lastItems,
                text: {
                    ...lastItems.text,
                    fa: dataresp.text,
                },
                translated: true,
            };

            setMessages(updatedMessages);
            return dataresp.text;

        } catch (error) {
            console.log("Error in translate_tofa:", error);
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
            setStatusTranslateSevice(false)
            // alert("ترجمه نا موفق بود")
        } finally {
            setIsStartTranslate(false);
        }
    };






    // تابع اصلی translateNew با مدیریت ترتیب بروزرسانی
    const translateNew = async (id) => {
        console.log("Old chat before translation:", oldChat[id]);
        const newItem = oldChat[id];
        let translationResult;
        console.log(" old cht   , ", oldChat[id])
        if (newItem.isEnglish && 'en' in newItem.parsedContent) {
            if (!('fa' in newItem.parsedContent)) {
                translationResult = await translate_tofa(newItem.parsedContent.en, newItem.chatId, newItem, id);
            }
            else {
                translationResult = true
            }

        } else if (!newItem.isEnglish && 'fa' in newItem.parsedContent) {
            if (!('en' in newItem.parsedContent)) {

                translationResult = await translate_toen(newItem.parsedContent.fa, newItem.chatId, newItem, id);

            }
            else {
                translationResult = true
            }

        } else {
            console.log("No content to translate!");
            return;
        }

        // تغییر وضعیت isEnglish پس از ترجمه
        if (translationResult) {
            toggleLanguageStatus(id);
        }

        console.log("Updated chat after translation:", oldChat[id]);
    };

    const just_translate_to_en = async (text, chat_id) => {
        if (!statusTranslateSevice) {
            console.log(" ERR ")
            return false
        }

        console.log("Translating to English...");
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translate-toen/${chat_id}`, {
                method: 'POST',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            if (!resp.ok) {
                const errorText = await resp.text();
                console.log("Error:", errorText);
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }
            const dataresp = await resp.json();
            console.log("Translated text (EN):", dataresp.text);
            if (dataresp.text === "Error!" || dataresp.text === "ترجمه نشده") {
                // alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
                setStatusTranslateSevice(false)
                return false
            }
            return dataresp.text;
        } catch (error) {
            console.log("Error in translate_toen:", error);
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
            setStatusTranslateSevice(false)
        }
    }

    const just_translate_to_fa = async (text, chat_id) => {
        if (!statusTranslateSevice) {
            console.log(" ERR ")
            return false
        }

        console.log("Translating to English...");
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translate-tofa/${chat_id}`, {
                method: 'POST',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            if (!resp.ok) {
                const errorText = await resp.text();
                console.log("Error:", errorText);
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }

            const dataresp = await resp.json();
            if (dataresp.text === "Error!" || dataresp.text === "ترجمه نشده") {
                // alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
                setStatusTranslateSevice(false)
                return false
            }
            console.log("Translated text (EN):", dataresp.text);
            return dataresp.text;
        } catch (error) {
            console.log("Error in translate_toen:", error);
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
            setStatusTranslateSevice(false)
        }
    }


    const translate_toen = async (text, chat_id, lastItems, id) => {
        if (!statusTranslateSevice) {
            console.log(" ERR ")
            return false
        }
        console.log("Translating to English...");

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translate-toen/${chat_id}`, {
                method: 'POST',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                console.log("Error:", errorText);
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }

            const dataresp = await resp.json();
            if (dataresp.text === "Error!" || dataresp.text === "ترجمه نشده") {
                alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
                setStatusTranslateSevice(false)
                return
            }

            console.log("Translated text (EN):", dataresp.text);

            setOldChat(prevChat =>
                prevChat.map(msg =>
                    msg.id === id
                        ? {
                            ...lastItems,
                            parsedContent: {
                                ...lastItems.parsedContent,
                                en: dataresp.text,
                            },
                            translated: dataresp.text
                        }
                        : msg
                )
            );

            return dataresp.text;

        } catch (error) {
            console.log("Error in translate_toen:", error);
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
            setStatusTranslateSevice(false)
        }
    };

    // کد ترجمه به فارسی با ذخیره‌ی ترجمه و به‌روزرسانی oldChat
    const translate_tofa = async (text, chat_id, lastItems, id) => {
        if (!statusTranslateSevice) {
            console.log(" ERR ")
            return false
        }
        console.log("Translating to Farsi...");

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translate-tofa/${chat_id}`, {
                method: 'POST',
                headers: {
                    Authorization: userData.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                console.log("Error:", errorText);
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }

            const dataresp = await resp.json();
            if (dataresp.text === "Error!" || dataresp.text === "ترجمه نشده") {
                alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
                setStatusTranslateSevice(false)
                return
            }
            console.log("Translated text (FA):", dataresp.text);

            setOldChat(prevChat =>
                prevChat.map(msg =>
                    msg.id === id
                        ? {
                            ...lastItems,
                            parsedContent: {
                                ...lastItems.parsedContent,
                                fa: dataresp.text, // ذخیره متن فارسی
                            },
                            translated: dataresp.text
                        }
                        : msg
                )
            );

            return dataresp.text;

        } catch (error) {
            console.log("Error in translate_tofa:", error);
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
            setStatusTranslateSevice(false)
        }
    };


    // Updated toggleLanguage function
    const toggleLanguage = (id) => {
        translateNew(id);
    };



    const toggleLanguageMsg = (index) => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[index].showEnglish = !newMessages[index].showEnglish;
            if (newMessages[index].isTypingCompleted === false) {
                newMessages[index].isTypingCompleted = true;
            }
            return newMessages;
        });
    };



    const toggleTranslation = (index) => {
        const container = document.getElementById('chatsc');
        container.scrollTop = container.scrollHeight;
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[index].showEnglish = !newMessages[index].showEnglish;
            newMessages[index].isTypingCompleted = true;
            return newMessages;
        });
        // const container = document.getElementById('chatsc');
        container.scrollTop = container.scrollHeight;
    };






    const handleClearChat = async () => {
        const lastSessionId = oldChat.length > 0 ? oldChat[oldChat.length - 1].session.id : sessionId;
        await deleteHistory(lastSessionId);

        setCountdown(20);
        const countdownInterval = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const replaceNewLinesWithBreaks = (text) => {
        return text.replace(/\n/g, '<br>');
    };


    const AnmarkdownToHtml = (markdown) => {

        // console.log('run');


        if (typeof markdown !== 'string') {

            markdown = String(markdown);

        }


        const container = document.getElementById('chatWrapRef');

        container.scrollTop = container.scrollHeight;


        const codeTagRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;


        const htmlContent = markdown.replace(codeTagRegex, (match, code, index) => {

            const highlightedCode = Prism.highlight(code, Prism.languages.python, 'python');

            return `
        <div style="position: relative">
        <pre class="language-python" style="display:flex;">
            <div class="preInternal">
            <button class="copy-button" data-id="code-${index}">Copy</button>
 
                    <code id="code-${index}">${highlightedCode}</code> 
            </div></pre>
</div>`;

        });


        container.scrollTop = container.scrollHeight;


        setTimeout(() => {

            document.querySelectorAll('.copy-button').forEach(button => {

                const newButton = button.cloneNode(true);

                button.parentNode.replaceChild(newButton, button);


                newButton.addEventListener('click', () => {

                    const codeId = newButton.getAttribute('data-id');

                    const codeElement = document.getElementById(codeId);

                    const range = document.createRange();

                    range.selectNodeContents(codeElement);

                    const selection = window.getSelection();

                    selection.removeAllRanges();

                    selection.addRange(range);


                    try {

                        document.execCommand('copy');

                        toast.success('Code copied to clipboard!');

                        // console.log('Code copied to clipboard!');

                    } catch (err) {

                        toast.error('Failed to copy code!');

                        // console.log('Failed to copy code!');

                    }


                    selection.removeAllRanges();

                });

            });

        }, 0);


        return htmlContent;

    };



    const formatSearchResults = (results) => {
        if (!results || !Array.isArray(results)) {
            return 'No results found.';
        }

        return results.map(result => `
            <div class="${style.searchResult}">
                <h3>${result.title}</h3>
                <p><strong>Question:</strong> ${AnmarkdownToHtml(result.question)}</p>
                <p><strong>Answer:</strong> ${AnmarkdownToHtml(result.answer)}</p>
                <p><strong>Tags:</strong> ${result.tags.join(', ')}</p>
            </div>
        `).join('');
    };



    const renderMessageContent = (msg, id) => {
        // console.log("load ")
        // console.log(msg)
        if (msg.side === 'AI' && msg.parsedContent) {
            let translationResult;
            if (msg.parsedContent.en || msg.parsedContent.fa) {
                // if (responseLang === "EN" && !(msg.parsedContent.en)){
                //     // start to en

                //     translationResult = await translate_toen(msg.parsedContent.fa, msg.chatId, msg, id);

                // }

                // if (responseLang === "FA" && !(msg.parsedContent.fa)){
                //     // start to fa
                //     translationResult = await translate_tofa(msg.parsedContent.en, msg.chatId, msg, id);
                // }   
                console.log(" msg.isEnglish ", msg.isEnglish)

                return msg.isEnglish ? (msg.parsedContent.en ? markdownToHtml(msg.parsedContent.en) : '') : (msg.parsedContent.fa ? markdownToHtml(msg.parsedContent.fa) : '');
            } else {
                console.log(msg.parsedContent)
                return msg.isEnglish ? (msg.parsedContent.chat ? markdownToHtml(msg.parsedContent.chat) : '') : (msg.parsedContent.chat ? markdownToHtml(msg.parsedContent.chat) : '');
            }


        } else if (msg.side === 'ANSWER' && Array.isArray(msg.parsedContent)) {
            return formatSearchResults(msg.parsedContent);
        }
        return markdownToHtml(msg.textbox);
    };


    const handleSendMessage = async (message, type) => {
        const newMessage = { text: message, type: 'chat', contentType: 'text', isSystemMessage: false };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        const replyData = await addMessage(message, type);
        if (replyData) {
            if (type === 'search') {
                let parsedReply;
                try {
                    parsedReply = JSON.parse(replyData);
                } catch (e) {
                    console.error("Error parsing reply data:", e);
                    parsedReply = null;
                }

                const replyMessage = {
                    text: parsedReply,
                    type: 'ANSWER',
                    contentType: 'html',
                    isSystemMessage: true,
                    showEnglish: true,
                    isTypingCompleted: false
                };
                setMessages(prevMessages => [...prevMessages, replyMessage]);
            } else {
                let parsedReply;
                try {
                    parsedReply = JSON.parse(replyData);
                } catch (e) {
                    console.error("Error parsing reply data:", e);
                    parsedReply = null;
                }

                const replyMessage = {
                    text: parsedReply,
                    type: 'AI',
                    contentType: parsedReply ? parsedReply.type : 'text',
                    isSystemMessage: true,
                    showEnglish: true,
                    isTypingCompleted: false
                };
                setMessages(prevMessages => [...prevMessages, replyMessage]);
                // setSessionId(parsedReply ? parsedReply.session_id : sessionId);
            }
        }
    };


    const msgTextBoxPars = (textbox) => {
        try {
            const isJSONArray = textbox.trim().startsWith("[") && textbox.trim().endsWith("]");

            if (isJSONArray) {
                const parsedContent = eval(textbox);

                if (Array.isArray(parsedContent)) {
                    return parsedContent.map(item => {
                        const { title, answer, question, tags } = item;

                        let formattedContent = `<h2>${title}</h2>`;
                        formattedContent += `<p><strong>Question:</strong> ${AnmarkdownToHtml(question)}</p>`;
                        formattedContent += `<p><strong>Answer:</strong> ${AnmarkdownToHtml(answer)}</p>`;
                        if (tags && Array.isArray(tags)) {
                            formattedContent += `<div class="tags"><strong>Tags:</strong> ${tags.join(', ')}</div>`;
                        }

                        formattedContent = formattedContent.replace(/\\\"/g, '"').replace(/\\'/g, "'");

                        return formattedContent;
                    }).join('<br>');
                } else {
                    console.error("Parsed content is not an array");
                    return textbox.replace(/\n/g, '<br>').replace(/\\\"/g, '"').replace(/\\'/g, "'");
                }
            } else {
                console.error("Textbox content is not a valid JSON array");
                return textbox.replace(/\n/g, '<br>').replace(/\\\"/g, '"').replace(/\\'/g, "'");
            }
        } catch (e) {
            console.error("Error parsing textbox content:", e);
            return textbox.replace(/\n/g, '<br>').replace(/\\\"/g, '"').replace(/\\'/g, "'");
        }
    };


    const checkenorfa = (text) => {
        const pt = /[\u0600-\u06FF]/
        return pt.test(text)
    }

    return (
        <div className={style.chatContainer} id={"chatsc"}>

            <ToastContainer />
            <div className={style.chatWrap} ref={chatWrapRef} id={'chatWrapRef'}>

                {oldChat.map((msg, index) => (
                    <div key={index}>
                        
                        {msg.side === "CHAT" || msg.side === "SEARCH" ? (
                            <div className={style.userMessage}>
                                <div className={style.userAvatar}>
                                    <Image
                                        src={userData && userData.image && userData.image !== 'None' ? `${userData.image}` : "/img/avatar.svg"}
                                        alt={"کاربر"} width={128} height={128} />
                                </div>
                                <div className={style.messageContent}>
                                    <h2 className={style.personName}>
                                        {userData ? `${userData.name} ${userData.family}` : "شما"}
                                    </h2>
                                    <div dangerouslySetInnerHTML={{ __html: renderMessageContent(msg, index) }}></div>
                                </div>
                            </div>
                        ) : null}

                        {msg.side === "AI" ? (
                            <div className={style.chatBox}>
                                <div className={style.systemMessage}>
                                    <div className={style.systemAvatar}>
                                        {icon && <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/${icon}`} alt={"دستیار خاتم"} width={128}
                                            height={128} />}
                                    </div>
                                    <div className={style.messageContent}>
                                        <h2 className={style.personName}>دستیار {llmname && <>{llmname}</>}</h2>

                                        {

                                            msg.isEnglish ?
                                                <div className={style.enMessage}>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: renderMessageContent(msg, index) }}></div>
                                                </div> : <div>
                                                    <div className={style.faMessage}
                                                        dangerouslySetInnerHTML={{ __html: renderMessageContent(msg, index) }}></div>

                                                </div>

                                        }


                                    </div>
                                    <div className={style.underSystemMessage}>
                                        <div className={style.starsForRating}>
                                            <Rating
                                                initialValue={msg.rating}
                                                onClick={(rate) => handleRating(rate, msg.chatId)}
                                                size={16}
                                                iconsCount={5}
                                                emptyIcon={<IconStar size={"16px"} color={"#999999"}
                                                    className={style.starItem} />}
                                                fillIcon={<IconStarFill size={"16px"} color={"gold"}
                                                    className={style.starItem} />}
                                            />
                                        </div>

                                        {checklang && responseLang && statusTranslateSevice ?
                                            <button onClick={() => toggleLanguage(msg.id)}
                                                className={style.toggleTranslation}>
                                                {resplang && resplang == "EN" ? <>
                                                    {msg.isEnglish ? "ترجمه به فارسی" : "translate to english"}
                                                </> : <></>}
                                                {resplang && resplang == "FA" ? <>
                                                    {msg.isEnglish ? "translate to english" : "ترجمه به فارسی"}
                                                </> : <></>}
                                            </button> : ""}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {msg.side === "ANSWER" ? (
                            <div className={style.resultBox}>
                                <div className={style.systemMessage}>
                                    <div className={style.systemAvatar}>
                                        {icon && <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/${icon}`} alt={"دستیار خاتم"} width={128}
                                            height={128} />}
                                    </div>
                                    <div className={style.messageContent}>
                                        <h2 className={style.personName}>دستیار {llmname && <>{llmname}</>}</h2>
                                        {/*<div className={style.oldSearchResult} dangerouslySetInnerHTML={{ __html: msgTextBoxPars(msg.textbox) }} />*/}
                                        {/*<div className={style.oldSearchResult}>{msgTextBoxPars(msg.textbox)}</div>*/}
                                        {/*<div className={style.oldSearchResult}>*/}
                                        {/*    {msgTextBoxPars(msg.textbox)}*/}
                                        {/*</div>*/}
                                        <div className={style.oldSearchResult}
                                            dangerouslySetInnerHTML={{ __html: msgTextBoxPars(msg.textbox) }} />
                                    </div>
                                    <div className={style.underSystemMessage}>
                                        <div className={style.starsForRating}>
                                            <Rating
                                                initialValue={msg.rating}
                                                onClick={(rate) => handleRating(rate, msg.chatId)}
                                                size={16}
                                                iconsCount={5}
                                                emptyIcon={<IconStar size={"16px"} color={"#999999"}
                                                    className={style.starItem} />}
                                                fillIcon={<IconStarFill size={"16px"} color={"gold"}
                                                    className={style.starItem} />}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                    </div>

                ))}
                <div className={style.clearHistory}>
                    <button onClick={handleClearChat} disabled={countdown !== 0}>
                        {countdown > 0 ? `پاکسازی حافظه گفتوگو (${countdown})` : <><IconTrash size={"32px"}
                            color={"#282828"} />
                            <span>پاکسازی حافظه گفتوگو</span></>}
                    </button>
                    <button onClick={scrollToBottom} className={style.scrollToBottomButton}>
                        <IconDown size={"32px"} color={"#113e66"} />
                    </button>
                </div>
                {hasMessageBeenSent &&
                    <>
                        {messages.map(({
                            text,
                            type,
                            isSystemMessage,
                            contentType,
                            showEnglish,
                            isTypingCompleted,
                            result_Id
                        }, index) => (
                            <div key={index} id={type === 'chat' ? 'resultBox' : 'chatBox'}
                                className={`${type === 'chat' ? style.resultBox : type === 'answer' ? style.searchBox : style.chatBox}`}>
                                {isSystemMessage ? (
                                    <div className={style.systemMessage}>
                                        <div className={style.systemAvatar}>
                                            {icon && <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/${icon}`} alt={"دستیار خاتم"} width={128}
                                                height={128} />}
                                        </div>
                                        <div
                                            className={`${style.messageContent} ${type === 'loader' ? (isChosen ? style.loaderChat : style.loaderSearch) : ''}`}>
                                            <h2 className={style.personName}>دستیار {llmname && <>{llmname}</>}</h2>
                                            {type === 'loader' ? (
                                                <IconLoaderAnimated size={"48px"} />
                                            ) : (
                                                <>
                                                    {type === 'answer' ? (
                                                        <div>
                                                            <div
                                                                dangerouslySetInnerHTML={{ __html: formatSearchResults(text.answer) }}>
                                                            </div>

                                                        </div>
                                                    ) :


                                                        <>

                                                            {
                                                                statusTranslateSevice && responseLang === "EN" ?
                                                                    <>
                                                                        {
                                                                            showEnglish ? <>
                                                                                {
                                                                                    text.en ? <>
                                                                                        <div className={style.enMessage}><KhatamTypeWriter
                                                                                            chatWrapRef={chatWrapRef}
                                                                                            text={markdownToHtml(text.en)}
                                                                                            speed={10}
                                                                                            isCode={false}
                                                                                            startButtonClass={style.continueGenerating}
                                                                                            stopButtonClass={style.stopGenerating}
                                                                                            immediateDisplay={isTypingCompleted}
                                                                                            onTypingComplete={() => {
                                                                                                setMessages(prevMessages => {
                                                                                                    const newMessages = [...prevMessages];
                                                                                                    newMessages[index].isTypingCompleted = true;
                                                                                                    return newMessages;
                                                                                                });
                                                                                            }}
                                                                                        /></div>


                                                                                    </> : <>  <IconLoaderAnimated size={"48px"} /> </>
                                                                                }
                                                                            </> : (



                                                                                <div className={style.faMessage}><KhatamTypeWriter
                                                                                    chatWrapRef={chatWrapRef}
                                                                                    text={markdownToHtml(text.fa)}
                                                                                    speed={10}
                                                                                    isCode={false}
                                                                                    startButtonClass={style.continueGenerating}
                                                                                    stopButtonClass={style.stopGenerating}
                                                                                    immediateDisplay={isTypingCompleted}
                                                                                    onTypingComplete={() => {
                                                                                        setMessages(prevMessages => {
                                                                                            const newMessages = [...prevMessages];
                                                                                            newMessages[index].isTypingCompleted = true;
                                                                                            return newMessages;
                                                                                        });
                                                                                    }}


                                                                                /></div>
                                                                            )

                                                                        }
                                                                    </>
                                                                    : statusTranslateSevice && responseLang === "FA" ?
                                                                        (
                                                                            <>
                                                                                {
                                                                                    showEnglish ? <>
                                                                                        {
                                                                                            text.fa ? <>

                                                                                                <div className={style.faMessage}><KhatamTypeWriter
                                                                                                    chatWrapRef={chatWrapRef}
                                                                                                    text={markdownToHtml(text.fa)}
                                                                                                    speed={10}
                                                                                                    isCode={false}
                                                                                                    startButtonClass={style.continueGenerating}
                                                                                                    stopButtonClass={style.stopGenerating}
                                                                                                    immediateDisplay={isTypingCompleted}
                                                                                                    onTypingComplete={() => {
                                                                                                        setMessages(prevMessages => {
                                                                                                            const newMessages = [...prevMessages];
                                                                                                            newMessages[index].isTypingCompleted = true;
                                                                                                            return newMessages;
                                                                                                        });
                                                                                                    }}


                                                                                                /></div>

                                                                                            </> : <>  <IconLoaderAnimated size={"48px"} /> </>
                                                                                        }
                                                                                    </> : (
                                                                                        <div className={style.enMessage}><KhatamTypeWriter
                                                                                            chatWrapRef={chatWrapRef}
                                                                                            text={markdownToHtml(text.en)}
                                                                                            speed={10}
                                                                                            isCode={false}
                                                                                            startButtonClass={style.continueGenerating}
                                                                                            stopButtonClass={style.stopGenerating}
                                                                                            immediateDisplay={isTypingCompleted}
                                                                                            onTypingComplete={() => {
                                                                                                setMessages(prevMessages => {
                                                                                                    const newMessages = [...prevMessages];
                                                                                                    newMessages[index].isTypingCompleted = true;
                                                                                                    return newMessages;
                                                                                                });
                                                                                            }}
                                                                                        /></div>
                                                                                    )
                                                                                }
                                                                            </>

                                                                        ) :
                                                                        (
                                                                            <>
                                                                                {
                                                                                    text.fa ?
                                                                                        <>


                                                                                            <div className={style.faMessage}><KhatamTypeWriter
                                                                                                chatWrapRef={chatWrapRef}
                                                                                                text={markdownToHtml(text.fa)}
                                                                                                speed={10}
                                                                                                isCode={false}
                                                                                                startButtonClass={style.continueGenerating}
                                                                                                stopButtonClass={style.stopGenerating}
                                                                                                immediateDisplay={isTypingCompleted}
                                                                                                onTypingComplete={() => {
                                                                                                    setMessages(prevMessages => {
                                                                                                        const newMessages = [...prevMessages];
                                                                                                        newMessages[index].isTypingCompleted = true;
                                                                                                        return newMessages;
                                                                                                    });
                                                                                                }} /></div>
                                                                                        </> :
                                                                                        (
                                                                                            <>
                                                                                                <div className={style.enMessage}><KhatamTypeWriter
                                                                                                    chatWrapRef={chatWrapRef}
                                                                                                    text={markdownToHtml(text.en)}
                                                                                                    speed={10}
                                                                                                    isCode={false}
                                                                                                    startButtonClass={style.continueGenerating}
                                                                                                    stopButtonClass={style.stopGenerating}
                                                                                                    immediateDisplay={isTypingCompleted}
                                                                                                    onTypingComplete={() => {
                                                                                                        setMessages(prevMessages => {
                                                                                                            const newMessages = [...prevMessages];
                                                                                                            newMessages[index].isTypingCompleted = true;
                                                                                                            return newMessages;
                                                                                                        });
                                                                                                    }}
                                                                                                /></div>
                                                                                            </>
                                                                                        )
                                                                                }
                                                                            </>
                                                                        )
                                                            }
                                                        </>



                                                    }
                                                </>
                                            )}



                                        </div>
                                        {type === 'answer' ? (
                                            <>
                                                <div className={style.underSystemMessage}>
                                                    <div className={style.starsForRating}>
                                                        <Rating
                                                            onClick={(rate) => handleRating(rate, result_Id)}
                                                            size={16}
                                                            iconsCount={5}
                                                            emptyIcon={<IconStar size={"16px"} color={"#999999"}
                                                                className={style.starItem} />}
                                                            fillIcon={<IconStarFill size={"16px"} color={"gold"}
                                                                className={style.starItem} />}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {isTypingCompleted && (
                                                    <div className={style.underSystemMessage}>
                                                        <div className={style.starsForRating}>
                                                            <Rating
                                                                onClick={(rate) => handleRating(rate, result_Id)}
                                                                size={16}
                                                                iconsCount={5}
                                                                emptyIcon={<IconStar size={"16px"} color={"#999999"}
                                                                    className={style.starItem} />}
                                                                fillIcon={<IconStarFill size={"16px"} color={"gold"}
                                                                    className={style.starItem} />}
                                                            />
                                                        </div>
                                                        {type === 'AI' && <>
                                                            {checklang && responseLang && statusTranslateSevice ?
                                                                <button onClick={() => toggleLanguageMsg(index)}
                                                                    className={style.toggleTranslation}>
                                                                    {resplang && resplang == "EN" ? <>
                                                                        {showEnglish ? "ترجمه به فارسی" : "translate to english"}
                                                                    </> : <></>}
                                                                    {resplang && resplang == "FA" ? <>
                                                                        {showEnglish ? "translate to english" : "ترجمه به فارسی"}
                                                                    </> : <></>}
                                                                </button> : ""}
                                                        </>}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                    </div>
                                ) : (
                                    <div className={style.userMessage}>
                                        <div className={style.userAvatar}>
                                            <Image
                                                src={userData && userData.image && userData.image !== 'None' ? `${userData.image}` : "/img/avatar.svg"}
                                                alt={"کاربر"} width={128} height={128} />
                                        </div>
                                        <div className={style.messageContent}>
                                            <h2 className={style.personName}>
                                                {userprofile ? `${userprofile.name} ${userprofile.family}` : "شما"}
                                            </h2>
                                            {text}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                }
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}