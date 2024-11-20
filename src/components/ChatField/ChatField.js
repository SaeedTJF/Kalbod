import style from "./ChatField.module.css";
import {IconSendArrow} from "@/components/Icons/iconSendArrow";
import {useState, useEffect} from "react";
import { useChat } from '@/contexts/ChatContext';

export default function ChatField ({ isChosen, setIsChosen, onMessageSend  }) {
    const [inputText, setInputText] = useState("");
    const [buttonColor, setButtonColor] = useState("#D0D5DD");

    const { addMessage, setHasMessageBeenSent } = useChat();

    const initialInputType = isChosen ? 'chat' : 'search';
    const [inputType, setInputType] = useState(initialInputType);

    useEffect(() => {
        setInputType(isChosen ? 'chat' : 'search');
    }, [isChosen]);

    const handleSubmit = () => {
        if (inputText.trim()) {
            addMessage(inputText, inputType);
            setInputText('');
            setHasMessageBeenSent(true);
        }
    };
    const handleKeyDown = (event) => {
        // بررسی می‌کنیم که آیا کلید فشرده شده Enter است و Shift فشرده نشده باشد
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // جلوگیری از ایجاد خط جدید
            handleSubmit(); // ارسال پیام
        }
    };


    useEffect(() => {
        setButtonColor(inputText ? "#FFA500" : "#D0D5DD");
    }, [inputText]);

    return (
        <div className={style.chatField}>
            <div className={style.chatForm}>
                {isChosen ? (
                    <textarea id="chatInput" dir="auto" rows={1} placeholder="متن گفتوگوی خود را بنویسید..." value={inputText} onKeyDown={handleKeyDown}  onChange={e => setInputText(e.target.value)}/>
                ) : (
                    <textarea id="searchInput" dir="auto" rows={1} placeholder="متن سوال خود را بنویسید..." value={inputText} onKeyDown={handleKeyDown}  onChange={e => setInputText(e.target.value)}/>
                )}

                <div className={style.chatFormBtns}>
                    <div className={style.formChoices}>
                        <div id={"formChat"}
                             className={`${style.formChat} ${isChosen ? style.formChoiceActive : style.formChoiceNotActive}`}
                             onClick={() => setIsChosen(true)}>گفت و گو
                        </div>
                        <div id={"formSearch"}
                             className={`${style.formSearch} ${isChosen ? style.formChoiceNotActive : style.formChoiceActive}`}
                             onClick={() => setIsChosen(false)}>پرس و جو
                        </div>
                    </div>
                    <div className={style.formSend} onClick={handleSubmit}>
                        <IconSendArrow color={buttonColor} size={"16px"}/>
                    </div>
                </div>
            </div>
        </div>
    );
}