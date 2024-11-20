import style from './AdminHeader.module.css'
import logo from "@/layouts/DashboardLayout/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import {IconMoon} from "@/components/Icons/iconMoon";
import {IconSun} from "@/components/Icons/iconSun";
import {isMobile} from "react-device-detect";
import {IconMenuDotsVertical} from "@/components/Icons/iconMenuDotsVertical";

export default function AdminHeader ({theme, toggleTheme}) {
    const [userData, setUserData] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(true);



    useEffect(() => {
        
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
        }
    }, []);


    useEffect(() => {
        setIsMobileView(isMobile);
    }, []);

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = 'http://10.35.44.104:3000/outprocess';
    };

    return (
        <div className={style.header}>
            {isMobileView && (
                <div id={"mobileMenuBtn"} onClick={handleMenuOpen} className={style.mobileMenuBtn}>
                    <IconMenuDotsVertical size={"32px"} color={"#ffffff"} />
                </div>
            )}
            <div className={style.logo}>
                <Link href={"/dashboard"}>
                    <Image src={logo} alt={"دانشگاه خاتم"}/>
                </Link>
            </div>

            <div className={isMobileView ? style.notShowInMobile : ""}>
                <ul className={style.navLinks}>
                    <li>
                        <Link href={"/panel"}>
                            <span>داشبورد</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/panel/Chat"}>
                            <span>مدیریت چت ها</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/panel/Llm"}>
                            <span>مدیریت مدل ها</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/panel/Users"}>
                            <span>مدیریت کاربران</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/panel/Session"}>
                            <span>مدیریت سشن ها</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/panel/Monitoring"}>
                            <span>مانیتورینگ</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/panel/log"}>
                            <span>گزارش</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className={isMobileView ? style.notShowInMobile : ""}>
                <div className={style.headerUserItems}>
                    {/*<div className={style.themeSwitch}>*/}
                    {/*    <button onClick={toggleTheme}*/}
                    {/*            className={theme === 'light' ? style.btnToDark : style.btnToLight}>*/}
                    {/*        {theme === 'light' ? <IconMoon size={"24px"} color={"#ffffff"}/> :*/}
                    {/*            <IconSun size={"24px"} color={"#ffa017"}/>}*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    <div className={style.userAvatar}>
                        {userData && userData.image ? <>
                            {userData && <Image src={userData.image} alt={"55"} width={45} height={45}/>}
                        </> : <>
                            <Image src={"/img/avatar.svg"} alt={"55"} width={45} height={45}/>
                        </>}
                    </div>
                    <div className={style.userDetails}>
                        <span>{userData && <>{userData.name}</>}</span>
                        <span>  {userData && <>{userData.family}</>}</span>
                    </div>
                    <div className={style.logOut} onClick={handleLogout}>خروج</div>
                </div>
            </div>
            {isMobileView && !isMenuOpen && (
                <>
                    <ul className={style.mobileMenu}>

                        {/*<div className={style.themeSwitch}>*/}
                        {/*    <button onClick={toggleTheme}*/}
                        {/*            className={theme === 'light' ? style.btnToDark : style.btnToLight}>*/}
                        {/*        {theme === 'light' ? <IconMoon size={"24px"} color={"#ffffff"}/> :*/}
                        {/*            <IconSun size={"24px"} color={"#ffa017"}/>}*/}
                        {/*    </button>*/}
                        {/*</div>*/}

                        <div className={style.userAvatar}>
                            {userData && userData.image ? <>
                                {userData && <Image src={userData.image} alt={"55"} width={45} height={45}/>}
                            </> : <>
                                <Image src={"/img/avatar.svg"} alt={"55"} width={45} height={45}/>
                            </>}
                        </div>
                        <div className={style.userDetails}>
                            <span>{userData && <>{userData.name}</>}</span>
                            <span>  {userData && <>{userData.family}</>}</span>
                        </div>


                        <li>
                            <Link href={"/panel"}>
                                <span>داشبورد</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/panel/Chat"}>
                                <span>مدیریت چت ها</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/panel/Llm"}>
                                <span>مدیریت مدل ها</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/panel/Users"}>
                                <span>مدیریت کاربران</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/panel/Session"}>
                                <span>مدیریت سشن ها</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/panel/Monitoring"}>
                                <span>مانیتورینگ</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/panel/log"}>
                                <span>گزارش</span>
                            </Link>
                        </li>
                        <div className={style.logOut} onClick={handleLogout}>خروج</div>
                    </ul>
                </>
            )}

        </div>
    )
}