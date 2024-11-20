import "../../app/globals.css";
import style from './DashboardLayout.module.css'
import ChatField from "@/components/ChatField/ChatField";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { useState } from 'react';
import {ChatProvider} from "@/contexts/ChatContext";
export default function DashboardLayout({ children }) {
    const [isChosen, setIsChosen] = useState(true);
    return (
        <ChatProvider>
            <div className={style.flexSpace}>
                    <Sidebar />
                <div className={style.dashboardPage}>
                    <div className={style.dashboardMain}>
                        {React.cloneElement(children, { isChosen, setIsChosen })}
                    </div>
                    <ChatField isChosen={isChosen} setIsChosen={setIsChosen} />
                </div>
            </div>
        </ChatProvider>
    );
}