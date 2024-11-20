import { useEffect, useRef, useState } from "react";
import style from './TypeWriter.module.css';

export default function KhatamTypeWriter({ text, speed = 100, isCode = false, startButtonClass = "", stopButtonClass = "", immediateDisplay = false, onTypingComplete, chatWrapRef, onToggleTyping  }) {
    const [displayedText, setDisplayedText] = useState('');
    const index = useRef(0);
    const [isTyping, setIsTyping] = useState(!immediateDisplay);
    const [showButtons, setShowButtons] = useState(!immediateDisplay);
    const [onsc,setonsc] = useState(true)
    const [isSystemScrolling, setIsSystemScrolling] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        if (onToggleTyping) {
            onToggleTyping(toggleTyping, isTyping);
        }
    }, [isTyping, onToggleTyping]);

    useEffect(() => {

        const handleScroll = () => {

            const scrollRef = document.getElementById('chatsc');

            if (!isSystemScrolling && !hasScrolled) {

                setHasScrolled(true);
                scrollRef.removeEventListener('scroll', handleScroll);

            }

        };


        const scElement = document.getElementById('chatsc');

        if (scElement) {

            scElement.addEventListener('scroll', handleScroll);

        }


        return () => {

            if (scElement) {

                scElement.removeEventListener('scroll', handleScroll);

            }

        };

    }, [hasScrolled, isSystemScrolling]);


    const scrollToBottom = () => {

        if (!hasScrolled) {

            const container = document.getElementById('chatsc');

            setIsSystemScrolling(true);

            container.scrollTop += 1000;

            setTimeout(() => setIsSystemScrolling(false), 400); // Set a small timeout to reset the flag

        }

    };


    useEffect(() => {
        const container = document.getElementById('chatsc');
        container.scrollTop += 10000;
    }, []);
    useEffect(() => {

        if (immediateDisplay) {
            setDisplayedText(text);
            setShowButtons(false);
            onTypingComplete();
            scrollToBottom();
        } else if (isTyping && index.current < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(prev => {
                    const updatedText = prev + text.charAt(index.current);
                    index.current += 1;
                    if (index.current >= text.length) {
                        setIsTyping(false);
                        setShowButtons(false);
                        onTypingComplete();
                    }
                    return updatedText;
                });
                scrollToBottom();
            }, speed);

            return () => clearTimeout(timeoutId);
        }
    }, [isTyping, text, displayedText, speed, immediateDisplay]);

    const toggleTyping = () => {
        setIsTyping(!isTyping);
        setShowButtons(isTyping);
    };

    useEffect(() => {
        scrollToBottom();
    }, [displayedText]);

    const textOutput = isCode ? (
        <pre style={{ background: "black", color: "white", padding: "10px" }}>
            <code>{displayedText}</code>
        </pre>
    ) : (
        <div className={style.typeWriterText} dangerouslySetInnerHTML={{ __html: displayedText }}></div>
    );

    return (
        <div>
            {textOutput}
            {showButtons && (
                <button
                    onClick={toggleTyping}
                    className={isTyping ? stopButtonClass : startButtonClass}
                >
                    {isTyping ? 'توقف کن' : 'ادامه بده'}
                </button>
            )}
        </div>
    );
};
