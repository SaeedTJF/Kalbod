import { useState, useEffect } from 'react';
import style from './Home.module.css'
import {IconLoaderAnimated} from "@/components/Icons/iconLoaderAnimated";
import Typewriter from 'typewriter-effect';

export default function Home () {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleLoginClick = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    };

    return (
        <div className={style.homeBg}>
            {/*<div className={style.videoBg}>*/}
            {/*    <video muted={true} autoPlay={true} loop={true}>*/}
            {/*        <source src="/img/bg.mp4" type="video/mp4"/>*/}
            {/*    </video>*/}
            {/*</div>*/}
            <div className={style.homeContainer}>
                <div className={style.homeBox}>
                    <div className={style.right}>
                    <div className={style.loginActions}>
                            <h1>سیستم دستیار هوشمند خاتم</h1>
                            {loading ? (
                                <IconLoaderAnimated size={"120px"} />
                            ) : (
                                <button className={style.authBtn} onClick={handleLoginClick}>
                                    <img src={"/img/pod.svg"} />
                                    <span>ورود با حساب پاد</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={style.left}>
                        <div className={style.leftBox}>
                            <img src={"/img/khatam-blue.png"}/>
                            <div className={style.homeTyping}>
                                <Typewriter
                                    onInit={(typewriter) => {
                                        typewriter.changeDelay('80')
                                        typewriter.typeString(`<span>به دستیار هوشمند خاتم خوش آمدید</span><br>`)
                                            .pauseFor(2500)
                                        typewriter.typeString(`<span>اینجا میتوانید به کمک <b>هوش مصنوعی داتین</b>، مشکلات برنامه نویسی خود را حل کنید.</span>`)
                                            .start();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
