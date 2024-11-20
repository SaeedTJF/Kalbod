import "../../app/globals.css";
import style from './AdminLayout.module.css'
import AdminHeader from "@/components/Admin/AdminHeader/AdminHeader";
import {useEffect, useState} from "react";

export default function AdminLayout({ children }) {

    const [theme,setTheme] = useState('light');

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
    return (
        <>
            <div className={`${style.main} ${theme === 'light' ? "light" : "dark"}`}>
                <AdminHeader toggleTheme={toggleTheme} theme={theme}/>
                <div className={style.container}>
                    {children}
                </div>
            </div>
        </>
    )
}