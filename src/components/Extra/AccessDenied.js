import style from './AccessDenied.module.css'
import Image from "next/image";
import Link from "next/link";
export default function AccessDenied () {
    return (
        <div className={style.accessDenied}>
            <div className={style.accessDeniedContainer}>
                <h2>دسترسی به این صفحه برای شما امکان پذیر نمیباشد.</h2>
                <Image src={"/img/accessdenied.svg"} alt={"Access Denied"} width={500} height={500}/>
                <div className={style.btnToHome}>
                    <Link href={"/"}>
                        بازگشت به صفحه نخست
                    </Link>
                </div>

            </div>

        </div>
    )
}