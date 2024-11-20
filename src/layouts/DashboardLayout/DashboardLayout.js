import "../../app/globals.css";
import style from './DashboardLayout.module.css';
import ChatField from "@/components/ChatField/ChatField";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { useState, useEffect } from 'react';
import { useChat, ChatProvider } from "@/contexts/ChatContext";
import { useRouter } from "next/router";

function DashboardContent({ children, isChosen, setIsChosen, setlang, lang }) {
    const { fetchAllSessions, sessions, userData, deleteSession, resetState, resetDashboard } = useChat();

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };
    useEffect(() => {
        if (userData) {
            fetchAllSessions();
        }
    }, [userData]);

    return (
        <>
            <div className={`${style.flexSpace} ${theme === 'light' ? "light" : "dark"}`}>
                <Sidebar isChosen={isChosen} setIsChosen={setIsChosen} lang={lang} setlang={setlang} toggleTheme={toggleTheme} theme={theme} />
                <div className={style.dashboardPage}>
                    <div className={style.dashboardMain}>
                        {React.cloneElement(children, { isChosen, setIsChosen,setlang, lang })}
                    </div>
                    <ChatField isChosen={isChosen} setIsChosen={setIsChosen} lang={lang} setlang={setlang} />
                </div>
            </div>
        </>);
}

export default function DashboardLayout({ children }) {
    const [isChosen, setIsChosen] = useState("1");
    const [lang, setlang] = useState("EN-FA");
    const [dataresp, setdataresp] = useState(null);
    const { userData } = useChat();
    const router = useRouter()

    useEffect(() => {
        setIsChosen(isChosen)
        fechdata()
    }, [isChosen]);

    const fechdata = async () => {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/llmservers/`, {
            headers: {
                Authorization: "Amin_4545",
                'Content-Type': 'application/json',
            },
        });
        const dataresp = await resp.json();
        setdataresp(dataresp)
    }
    return (
        <ChatProvider>
            {/* <div className={style.haedbar}>
                <select className={style.selecthead} onChange={(e)=>setIsChosen(e.target.value)} value={isChosen} id="selecthead">
                {dataresp && dataresp.map(mp=><>
                    <option value={mp.id}>{mp.name}</option>

                </>)}
                </select>
            </div> */}
            {/*<button onClick={()=>console.log(isChosen)}>ssssss</button>*/}
            <DashboardContent isChosen={isChosen} setIsChosen={setIsChosen} lang={lang} setlang={setlang}>
                {children}
            </DashboardContent>
        </ChatProvider>
    );
}
