import style from "./ChatField.module.css";
import { IconSendArrow } from "@/components/Icons/iconSendArrow";
import { useState, useEffect } from "react";
import { useChat } from '@/contexts/ChatContext';
import { IconSendArrowNew } from "@/components/Icons/iconSendArrowNew";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChatField({ isChosen, setIsChosen, onMessageSend, sessionId }) {
    const [inputText, setInputText] = useState("");
    const [buttonColor, setButtonColor] = useState("#D0D5DD");
    const [isSending, setIsSending] = useState(false);
    const [dataresp, setdataresp] = useState(null)
    const { addMessage, setHasMessageBeenSent } = useChat();
    const [iserror, setiserror] = useState(0)
    const initialInputType = isChosen;
    const [inputType, setInputType] = useState(initialInputType);

    useEffect(() => {
        fechdata()
        setInputType(isChosen);
        setInputText('')
    }, [isChosen]);



    const fechdata = async () => {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/llmservers_without_h/`, {
            headers: {
                Authorization: "Amin_4545",
                'Content-Type': 'application/json',
            },
        });
        const datares = await resp.json();
        setdataresp(datares)
    }

    const handleSubmit = async () => {
        // document.getElementById('selecthead').disabled = true
        document.getElementById('selectheadside').disabled = true


        setIsChosen(inputType)
        if (inputText.trim()) {
            setIsSending(true);
            try {
                const container = document.getElementById('chatsc');
                container.scrollTop += 10000;
            } catch (error) {
                console.log(error)
            }

            await addMessage(inputText, inputType, sessionId);
            setInputText('');
            setHasMessageBeenSent(true);
            setIsSending(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        setButtonColor(inputText ? "#FFA500" : "#D0D5DD");
    }, [inputText]);

    const handleChange = (e) => {
        let datavalue = ""
        for (let i in dataresp) {
            if (dataresp[i].id == isChosen) {
                if (dataresp[i].language == "FA") {

                    const inputText = e.target.value;

                    const isFarsi = (text) => {
                        if (text == "") {
                            setInputText("")
                            return ""
                        }
                        const farsiPattern = /^[\u0600-\u06FF\s]+$/;
                        return farsiPattern.test(text);
                    };

                    if (isFarsi(inputText)) {
                        setInputText(inputText);
                        setiserror(0)
                    } else {
                        // alert('لطفاً فقط فارسی تایپ کنید.');
                        if (iserror == 0) {

                            // toast.info('فقط میتوانید فارسی تایپ کنید')
                        }
                        else {

                        }
                        setiserror(1)
                    }
                } else if (dataresp[i].language == "EN") {

                    const inputText = e.target.value;
                    const isEnglish = (text) => {
                        if (text == "") {
                            setInputText("")
                            return ""
                        }
                        const englishPattern = /^[A-Za-z\s]+$/;
                        return englishPattern.test(text);
                    };
                    if (isEnglish(inputText)) {
                        setInputText(inputText);
                        setiserror(0)
                    } else {
                        if (iserror == 0) {

                            // toast.info('فقط میتوانید انگلیسی تایپ کنید')
                        }
                        else {

                        }
                        setiserror(1)
                        //  alert('Please enter only English letters.'); 
                    }

                } else {
                    const inputText = e.target.value;

                    setInputText(inputText);
                }
            }
        }

    };

    const [height, setHeight] = useState(50); // ارتفاع پیش‌فرض

    const handleInput = (event) => {
        const textarea = event.target;
        const lineHeight = 25; // ارتفاع هر خط بر اساس فونت و استایل‌های CSS
        const maxLines = 4; // حداکثر تعداد خطوط

        const currentLines = textarea.value.split("\n").length; // محاسبه تعداد خطوط فعلی
        const newHeight = Math.min(currentLines, maxLines) * lineHeight;

        setHeight(newHeight);
    };
    return (
        <div className={style.chatField}>
            <ToastContainer />
            <div className={style.chatForm}>
                <textarea
                    style={{ height: `${height}px`}}
                    onInput={handleInput}
                    id={"chatInput"}
                    dir="auto"
                    rows={1}
                    placeholder={"متن گفت و گوی خود را بنویسید..."}
                    value={inputText}
                    onKeyDown={handleKeyDown}
                    onChange={e => handleChange(e)}
                    disabled={isSending} // غیرفعال کردن فیلد در زمان ارسال
                />
                <div className={style.chatFormBtns}>
                    {!isSending && <>
                        <div className={style.formSend} onClick={handleSubmit}>
                            <IconSendArrowNew color={buttonColor} size={"16px"} />
                            {/*<IconSendArrow color={buttonColor} size={"16px"}/>*/}
                        </div>
                    </>}

                </div>
            </div>
        </div>
    );
}
