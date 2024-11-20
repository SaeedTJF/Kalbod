import style from './ChatConversation.module.css'
import ChatStartImage from './ChatStartImage.svg'
import ChatImage from './ChatImage.svg'
import SearchImage from './SearchImage.svg'
import Image from "next/image";
import { useChat } from '@/contexts/ChatContext'
import {IconLoaderAnimated} from "@/components/Icons/iconLoaderAnimated";
import Link from "next/link";
import {IconTrash} from "@/components/Icons/iconTrash";
import KhatamTypeWriter from "@/components/TypeWriter/TypeWriter";


export default function ChatConversation({ isChosen, setIsChosen, isTyping, toggleTyping}) {

    const { messages, hasMessageBeenSent, isLoading, resetState  } = useChat();



    return (
        <>
            {hasMessageBeenSent &&
            <div className={style.chatContainer}>
                <div className={style.chatWrap}>
                    {messages.map(({text, type, isSystemMessage, contentType}, index) => (
                        <div key={index}
                             id={type === 'chat' ? 'chatBox' : 'resultBox'}
                             className={`${type === 'chat' ? style.chatBox : style.resultBox}`}>
                            {isSystemMessage ? (
                                <div className={style.systemMessage}>
                                    <div className={style.systemAvatar}>
                                        <Image src={"/img/khatamBot.svg"} alt={"دستیار خاتم"} width={128} height={128}/>
                                    </div>
                                    <div className={style.messageContent}>
                                        <h2 className={style.personName}>دستیار هوشمند خاتم</h2>
                                        <KhatamTypeWriter text={text} speed={50} isCode={contentType === 'code'} startButtonClass={style.continueGenerating} stopButtonClass={style.stopGenerating} />
                                    </div>
                                </div>
                            ) : (
                                <div className={style.userMessage}>
                                    <div className={style.userAvatar}>
                                        <Image src={"/img/userImage.jpg"} alt={"سعید تاج آبادی فراهانی"} width={128} height={128}/>
                                    </div>
                                    <div className={style.messageContent}>
                                        <h2 className={style.personName}>شما</h2>
                                        {text}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className={style.systemMessage}>
                            <div className={style.systemAvatar}>
                                <Image src={"/img/khatamBot.svg"} alt={"دستیار خاتم"} width={128} height={128}/>
                            </div>
                            <div className={`${style.messageContent} ${isChosen ? style.messageLoading : style.messageLoadingSearch}`}>
                                <h2 className={style.personName}> دستیار هوشمند خاتم</h2>
                                <IconLoaderAnimated size={"48px"} />
                            </div>
                        </div>
                    )}
                </div>
                <div className={style.clearHistory}>
                    <Link href={"/"}><IconTrash size={"32px"} color={"#282828"} /> <span>پاکسازی چت</span></Link>
                </div>
            </div>
            }
            {!hasMessageBeenSent &&
                <div className={style.chatStart} id={"chatStart"}>

                    <div className={style.chatStartHeader}>
                        <Image src={ChatStartImage} alt="شروع"/>
                        <h2>دستیار هوشمند برنامه نویسی پایتون</h2>
                        <h3>سامانه هوشمند آموزش برنامه نویسی خاتم</h3>
                    </div>
                    <div className={style.chatOrSearch}>
                        <div id="chooseChat"
                             className={`${style.chooseBox} ${isChosen ? style.choosenBox : style.noChoosenBox}`}
                             onClick={() => setIsChosen(true)}>
                            <Image src={ChatImage} alt="شروع چت"/>
                            <h4>گفت و گو</h4>
                            <p>سوالات مربوط به برنامه نویسی خودت رو بپرسی و برای هر شوال جواب بگیر</p>
                        </div>
                        <div id="chooseSearch"
                             className={`${style.chooseBox} ${isChosen ? style.noChoosenBox : style.choosenBox}`}
                             onClick={() => setIsChosen(false)}>
                            <Image src={SearchImage} alt="شروع جستوجو"/>
                            <h4>پرس و جو</h4>
                            <p>اگر دنبال بهترین جواب هستی، سوالت رو بپرس و 3 گزینه از بهترین جواب ها و کدها رو ببین</p>
                        </div>
                    </div>
                </div>
            }

        </>
    );
}