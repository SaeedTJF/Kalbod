import style from './ChatConversation.module.css';
import ChatStartImage from './ChatStartImage.svg';
import ChatImage from './ChatImage.svg';
import SearchImage from './SearchImage.svg';
import Image from "next/image";
import { useChat } from '@/contexts/ChatContext';
import { IconTrash } from "@/components/Icons/iconTrash";
import KhatamTypeWriter from "@/components/TypeWriter/TypeWriter";
import { useEffect, useState, useRef } from "react";
import { Rating } from "react-simple-star-rating";
import { IconStar } from "@/components/Icons/iconStar";

import { IconLoaderAnimated } from "@/components/Icons/iconLoaderAnimated";
import { IconDown } from "@/components/Icons/iconDown";
import 'prismjs/themes/prism-okaidia.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconStarFill } from "@/components/Icons/iconStarFill";
import { IconArrowBottom } from "@/components/Icons/iconArrowBottom";

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
        <div style="position: relative">
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



const replaceNewLinesWithBreaks = (text) => {
    return text.replace(/\n/g, '<br>');
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

export default function ChatConversation({ isChosen, setIsChosen, isTyping, toggleTyping }) {
    const { messages, hasMessageBeenSent, resetState, userData, setMessages, deleteHistory, rateChat, resetDashboard } = useChat();

    const [rating, setRating] = useState(0);
    const [userprofile, setuserprofile] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const chatWrapRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedLlm, setSelectedLlm] = useState('');
    const [selectedLlmName, setSelectedLlmName] = useState('');
    const [selectedLlmIcon, setSelectedLLmIcon] = useState('')
    const llmChooseRef = useRef(null);
    const [isStartTranslate, setIsStartTranslate] = useState(false);
    const [dataresp, setdataresp] = useState(null);
    const [checklang, setchecklang] = useState(null);
    const [icon, seticon] = useState(null)
    const [responseLang, setResponseLang] = useState(true);
    const [resplang, setresplang] = useState(null)
    const [statusTranslateSevice, setStatusTranslateSevice] = useState(true);

    const handleOptionClick = (llmName, llmid, language, iconimg, responselang) => {
        setresplang(responselang)
        setSelectedLlm(llmid);
        setSelectedLlmName(llmName);
        setIsChosen(llmid)
        setShowOptions(false);
        setchecklang(language)
        seticon(iconimg)
    };
    const isBoxActive = (id) => {
        return selectedLlm === id ? style.choosenBox : style.noChoosenBox;
    };
    const handleClickOutside = (event) => {
        if (llmChooseRef.current && !llmChooseRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };



    useEffect(() => {
        if (dataresp && dataresp.length > 0) {
            setresplang(dataresp[0].response_language)
            setSelectedLlm(dataresp[0].id);
            setSelectedLlmName(dataresp[0].name);
            setIsChosen(dataresp[0].id);
            setchecklang(dataresp[0].language)
        }
    }, [dataresp]);
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                setResponseLang(lastItems.text.response_language)
                if (lastItems.type === "AI" && !isStartTranslate && !lastItems.translated) {
                    let t;
                    if ('en' in lastItems.text && !('ee' in lastItems)) {
                        t = await translate_tofa(lastItems.text.en, lastItems.text.chat_id, lastItems);
                    } else if ('fa' in lastItems.text && !('ee' in lastItems)) {
                        t = await translate_toen(lastItems.text.fa, lastItems.text.chat_id, lastItems);
                    } else {
                        console.log("NONE !");
                    }
                }
            }
        };

        translateMessage();
    }, [messages]);

    const translate_toen = async (text, chat_id, lastItems) => {
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
                    "lang": "fa"
                },
                translated: true,
            };

            setMessages(updatedMessages);
            return dataresp.text;

        } catch (error) {
            console.log("Error in translate_toen:", error);
            setStatusTranslateSevice(false)
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
        } finally {
            setIsStartTranslate(false);
        }
    };

    const translate_tofa = async (text, chat_id, lastItems) => {
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
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }

            const dataresp = await resp.json();
            console.log("resp", dataresp.text);
            if (dataresp.text === "Error!" || dataresp.text === "ترجمه نشده") {
                alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
                setStatusTranslateSevice(false)
                setIsStartTranslate(false);
                return
            }
            const updatedMessages = [...messages];
            updatedMessages[updatedMessages.length - 1] = {
                ...lastItems,
                text: {
                    ...lastItems.text,
                    fa: dataresp.text,
                    "lang": "en"
                },
                translated: true,
            };

            setMessages(updatedMessages);
            return dataresp.text;

        } catch (error) {
            console.log("Error in translate_tofa:", error);
            alert('سرویس ترجمه در حال حاضر فعال نمی باشد.');
            setStatusTranslateSevice(false)

        } finally {
            setIsStartTranslate(false);
        }
    };




    const fechdata = async () => {
        // console.log("Fetching all sessions with headers:");
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/llmservers_without_h/`, {
            headers: {
                Authorization: "Amin_4545",
                'Content-Type': 'application/json',
            },
        });
        const dataresp = await resp.json();
        setdataresp(dataresp)
        setSelectedLlm(dataresp[0].id)
    }
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setShowScrollButton(false); // پنهان کردن دکمه پس از اسکرول به پایین
    };

    const [userScrolled, setUserScrolled] = useState(false);

    const handleScroll = () => {
        if (chatWrapRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatWrapRef.current;
            if (scrollTop + clientHeight < scrollHeight - 10) {
                setUserScrolled(true); // اگر کاربر به سمت بالا اسکرول کرد
                setShowScrollButton(true);
            } else {
                setUserScrolled(false);
                setShowScrollButton(false);
            }
        }
    };


    useEffect(() => {
        if (chatWrapRef.current) {
            chatWrapRef.current.addEventListener("scroll", handleScroll);
            return () => {
                chatWrapRef.current.removeEventListener("scroll", handleScroll);
            };
        }
        fechdata()
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages[messages.length - 1]?.isTypingCompleted]);


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

    useEffect(() => {
        let datauser = localStorage.getItem('userData');
        setuserprofile(JSON.parse(datauser));
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);




    const toggleLanguage = (index) => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[index].showEnglish = !newMessages[index].showEnglish;
            if (newMessages[index].isTypingCompleted === false) {
                newMessages[index].isTypingCompleted = true;
            }
            return newMessages;
        });
    };


    const handleClearChat = async () => {
        const lastSessionId = messages.length > 0 ? messages[messages.length - 1].text.session_id : sessionId;
        await deleteHistory(lastSessionId);

        setCountdown(20);
        const countdownInterval = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 1) {
                    clearInterval(countdownInterval);
                    return null;
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    useEffect(() => {

        if (dataresp) {

            for (let i in dataresp) {
                if (isChosen == dataresp[i].id) {
                    setSelectedLlm(dataresp[i].id);
                    setSelectedLlmName(dataresp[i].name);
                    setIsChosen(dataresp[i].id)
                    setShowOptions(false);
                    setchecklang(dataresp[i].language)
                    seticon(dataresp[i].icon)
                }
            }
        }
    }, [isChosen]);




    return (
        <>
            <div className={style.llmChoose} ref={llmChooseRef} onClick={() => setShowOptions(!showOptions)}>
                <div className={style.chosenLlmName}>
                    <span>{selectedLlmName}</span><IconArrowBottom size={"14px"} color={"#6c6c6c"} />
                </div>
                {!hasMessageBeenSent && showOptions && (
                    <ul className={style.llmChooseBox} id="headchat">
                        {dataresp && dataresp.map(mp => <>
                            <li id={mp.id} style={{ cursor: "pointer" }} onClick={() => handleOptionClick(mp.name, mp.id, mp.language, mp.icon, mp.response_language)}>
                                {mp.status ? <span style={{ color: "green" }}>{mp.name}</span> : <span style={{ color: "red" }}>{mp.name}</span>}
                            </li>

                        </>)}
                    </ul>
                )}
            </div>
            <ToastContainer />
            {hasMessageBeenSent &&
                <div className={style.chatContainer} id={"chatsc"}>

                    <div className={style.chatWrap} ref={chatWrapRef} id={"chatWrapRef"}>
                        {/* {console.log(messages)} */}
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
                                            <h2 className={style.personName}>{selectedLlmName && <>{selectedLlmName}</>}</h2>
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
                                                                                        <div className={style.enMessage}>{console.log(showEnglish)}<KhatamTypeWriter
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
                                                                                        <div className={style.enMessage}>{console.log(showEnglish)}<KhatamTypeWriter
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
                                                                                                <div className={style.enMessage}>{console.log(showEnglish)}<KhatamTypeWriter
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

                                                            {checklang && responseLang && statusTranslateSevice ? <button onClick={() => toggleLanguage(index)}
                                                                className={style.toggleTranslation}>
                                                                {resplang && resplang == "EN" ? <>
                                                                    {showEnglish ?"ترجمه به فارسی" : "translate to english" }
                                                                </> : <></>}
                                                                {resplang && resplang == "FA" ? <>
                                                                    {showEnglish ? "translate to english" : "ترجمه به فارسی" }
                                                                </> : <></>}
                                                            </button> : ""}

                                                        </>
                                                        }
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
                        <div ref={messagesEndRef} />
                    </div>


                    <div className={style.clearHistory}>
                        <button onClick={handleClearChat} disabled={countdown !== null}>
                            {countdown !== null ? `پاکسازی حافظه گفتوگو (${countdown})` : <><IconTrash size={"32px"}
                                color={"#282828"} />
                                <span>پاکسازی حافظه گفتوگو</span></>}
                        </button>
                        <button onClick={scrollToBottom} className={style.scrollToBottomButton}>
                            <IconDown size={"32px"} color={"#113e66"} />
                        </button>
                    </div>
                </div>
            }
            {!hasMessageBeenSent &&
                <div className={style.chatStart} id={"chatStart"}>
                    <div className={style.chatStartHeader}>
                        <Image src={ChatStartImage} alt="شروع" />
                        <h2>دستیار هوشمند برنامه نویسی پایتون</h2>
                        <h3>سامانه هوشمند آموزش برنامه نویسی خاتم</h3>
                    </div>
                    <div className={style.chatOrSearch}>
                        {dataresp && dataresp.map(mp => <div className={style.chooseBoxItemWrap} key={mp.id}>{mp.status ? <div id={mp.id}
                            className={`${style.chooseBox} ${isBoxActive(mp.id)}`}
                            onClick={() => handleOptionClick(mp.name, mp.id, mp.language, mp.icon, mp.response_language)}>

                            <div className={style.modelImage}>
                                <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}${mp.icon}`} layout={"fill"} objectFit={"contain"} alt={mp.name} />
                            </div>
                            <h4>{mp.name}</h4>
                            {/*<p>وضعیت  : <b style={{ color: "green" }}>فعال </b></p>*/}
                            <p>زبان ورودی  : {mp.language}</p>
                            <p>{mp.description}</p>
                        </div>
                            :
                            <div id={mp.id}
                                className={`${style.chooseBox} ${isBoxActive(mp.id)}`}
                                // style={{border:"1px red solid"}}
                                onClick={() => handleOptionClick(mp.name, mp.id, mp.language, mp.icon, mp.response_language)}
                            >

                                <div className={style.modelImage}>
                                    <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}${mp.icon}`} layout={"fill"} objectFit={"contain"} alt={mp.name} />
                                </div>
                                <h4>{mp.name}</h4>
                                {/*<p>وضعیت  : <b style={{ color: "red" }}>غیرفعال </b></p>*/}
                                <p>زبان ورودی  : {mp.language}</p>
                                <p>{mp.description}</p>
                            </div>}
                        </div>

                        )}

                    </div>
                </div>
            }
        </>
    );
}
