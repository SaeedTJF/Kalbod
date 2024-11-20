import { useEffect, useRef, useState } from "react";
import style from './TypeWriter.module.css'

export default function KhatamTypeWriter({ text, speed = 100, isCode = false, startButtonClass = "", stopButtonClass = "" }) {
    const [displayedText, setDisplayedText] = useState('');
    const index = useRef(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (isTyping && index.current < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(displayedText + text.charAt(index.current));
                index.current += 1;
            }, speed);

            return () => clearTimeout(timeoutId);
        }
    }, [isTyping, text, displayedText, speed]);

    const toggleTyping = () => setIsTyping(!isTyping);

    const textOutput = isCode ? (
        <pre style={{ background: "black", color: "white", padding: "10px" }}>
            <code>{displayedText}</code>
        </pre>
    ) : (
        <div className={style.typeWriterCode} dangerouslySetInnerHTML={{ __html: displayedText }}></div>
    );

    return (
        <div>
            {textOutput}
            <button
                onClick={toggleTyping}
                className={isTyping ? stopButtonClass : startButtonClass}
            >
                {isTyping ? 'توقف کن' : 'ادامه بده'}
            </button>
        </div>
    );
};
