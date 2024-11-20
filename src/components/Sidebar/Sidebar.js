import style from "./Sidebar.module.css"
import Image from "next/image";
import logo from "@/layouts/DashboardLayout/logo.png";
import {IconChat} from "@/components/Icons/iconChat";
import {IconTrash} from "@/components/Icons/iconTrash";
import Link from "next/link";
import {BrowserView, isDesktop, isMobile, MobileView} from "react-device-detect";
import {useEffect, useState} from "react";
import {IconMenuDotsVertical} from "@/components/Icons/iconMenuDotsVertical";
export default function Sidebar () {
    const [isMobileView, setIsMobileView] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    useEffect(() => {
        setIsMobileView(isMobile);
    }, []);
    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen)
    }
    return (

        <>
            {isMobileView && <div id={"mobileMenuBtn"} onClick={handleMenuOpen} className={style.mobileMenuBtn}>
                <IconMenuDotsVertical size={"32px"} color={"#021D3E"} />
            </div> }
            <aside className={isMenuOpen ? style.aside : `${style.aside} ${style.asideMobileOpen}`}>
                    <div className={style.sidebar}>
                        <div className={style.sidebarTop}>
                            <div className={style.logo}>
                                <Image src={logo} alt={"دانشگاه خاتم"}/>
                            </div>
                            <div className={style.chatHistory}>
                                <h2>گفتگو</h2>
                                <div className={style.chatHistoryItem}>
                                    <div className={style.flex}>
                                        <IconChat size={"32px"} color={"#8E8EA0"}/>
                                        <span
                                            className={style.chatHistoryItemName}>برای من یک فرم با قابلیت هاور شدن</span>
                                    </div>

                                    <IconTrash cname={style.chatHistoryRemoveBtn} size={"32px"} color={"#ffffff"}/>
                                </div>

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
                                    <Link href={"#"}>دانش آموختگان</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>
        </>
)
}