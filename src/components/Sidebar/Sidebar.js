import style from "./Sidebar.module.css";
import Image from "next/image";
import logo from "@/layouts/DashboardLayout/logo.png";
import { IconChat } from "@/components/Icons/iconChat";
import { IconTrash } from "@/components/Icons/iconTrash";
import { IconMenuDotsVertical } from "@/components/Icons/iconMenuDotsVertical";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useChat } from '@/contexts/ChatContext';
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { IconNewChat } from "@/components/Icons/iconNewChat";
import {IconMoon} from "@/components/Icons/iconMoon";
import {IconSun} from "@/components/Icons/iconSun";

export default function Sidebar({ isChosen, setIsChosen ,setlang, lang, theme, toggleTheme}) {
    const [isMobileView, setIsMobileView] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const { fetchAllSessions, sessions, userData, deleteSession, resetState, resetDashboard } = useChat();
    const router = useRouter();
    const [dataresp, setdataresp] = useState(null);
    const { id: currentSessionId } = router.query; // اضافه شده برای دریافت sessionId فعلی از مسیر URL


    useEffect(() => {
        setIsMobileView(isMobile);
        if (userData) {
            fetchAllSessions();
            fechdata()
        }
    }, [userData]);

    useEffect(() => {
        setIsChosen(isChosen)
    }, [isChosen]);
    
    const fechdata = async () => {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/llmservers_without_h/`, {
            headers: {
                Authorization: "Amin_4545",
                'Content-Type': 'application/json',
            },
        });
        const dataresp = await resp.json();
        setdataresp(dataresp)
        if (! isChosen) {
        setIsChosen(dataresp[0].id)
        }
    }

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSessionClick = (sessionId) => {
        window.location.href = `/chat/${sessionId}`;
    };

    const handleDeleteSession = async (sessionId) => {
        await deleteSession(sessionId);
        if (router.query.id === String(sessionId)) {
            router.push('/dashboard');
        }
    };
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = 'http://10.35.44.104:3000/outprocess';
    };
    const handleNewChat = () => {
        router.push('/dashboard');
        // let selecthead =document.getElementById('selecthead')
        // selecthead.disabled = false
        let selectheadside =document.getElementById('selectheadside')
        selectheadside.disabled = false
        resetDashboard();
    };
    let checkandsetchose = (e)=>{
        let id= e.target.value
        setIsChosen(id)
    }
    return (
        <>
            {isMobileView && (
                <div id={"mobileMenuBtn"} onClick={handleMenuOpen} className={style.mobileMenuBtn}>
                    <IconMenuDotsVertical size={"32px"} color={"#021D3E"} />
                </div>
            )}
            <aside className={isMenuOpen ? style.aside : `${style.aside} ${style.asideMobileOpen}`}>
                <div className={style.sidebar}>
                    <div className={style.sidebarTop}>
                        <div className={style.logo}>
                            <Image src={logo} alt={"دانشگاه خاتم"}/>
                        </div>
                        <div className={style.themeSwitch}>
                            <button onClick={toggleTheme}
                                    className={theme === 'light' ? style.btnToDark : style.btnToLight}>
                                {theme === 'light' ? <IconMoon size={"24px"} color={"#ffffff"}/> :
                                    <IconSun size={"24px"} color={"#ffa017"}/>}
                            </button>
                        </div>
                        <div className={style.sidebarActionBtns}>
                            <button onClick={handleNewChat} className={style.newChatButton}>
                                <IconNewChat size={"24px"} color={"#cdcdcd"}/>
                                <span>چت جدید</span>
                            </button>
                            <button onClick={handleLogout} className={style.logoutButton}>خروج</button>
                        </div>
                        <div className={style.sidebarActionBtns}>
                            <select className={style.newChatButton} onChange={(e) => checkandsetchose(e)}
                                    value={isChosen} id="selectheadside">
                                {dataresp && dataresp.map((mp,key) => 
                                    <option value={mp.id} key={mp.id}>{mp.name} 
                                    {/* <b>{mp.status ? "✓" : "✘"}</b> */}
                                    </option>
                                )}
                            </select>
                            {/*<button onClick={()=>console.log(isChosen)}>test</button> */}
                        </div>
                        <div className={style.chatHistory}>
                            <h2>گفتگو</h2>
                            {sessions.map(session => (
                                <div key={session.id}
                                     className={`${style.chatHistoryItem} ${currentSessionId == session.id ? style.chatHistoryItemActive : ''}`}>
                                    <div className={style.flex}>
                                        <IconChat size={"32px"} color={"#8E8EA0"}/>
                                        <b
                                            className={style.chatHistoryItemName}
                                            onClick={() => handleSessionClick(session.id)}
                                        >
                                            {session.chattitle}
                                        </b>
                                    </div>
                                    <div onClick={() => handleDeleteSession(session.id)}
                                         className={style.removeSessionBtn}>
                                        <IconTrash
                                            className={style.chatHistoryRemoveBtn}
                                            size={"32px"}
                                            color={"#ffffff"}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={style.sidebarBottom}>
                        <h2>لینک های پیشنهادی</h2>
                        <ul>
                            <li>
                                <Link href={"#"}>کنفرانس و گردهمایی ها</Link>
                            </li>
                            <li>
                                <Link href={"#"}>دانشکده ها</Link>
                            </li>
                            <li>
                                <Link href={"#"}>اخبار و اعلانات</Link>
                            </li>
                            <li>
                                <Link href={"/panel"}>پنل مدیریت</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
}
