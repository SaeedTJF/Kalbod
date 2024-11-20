import "../../app/globals.css";
import style from './AdminLayout.module.css'
import AdminHeader from "@/components/Admin/AdminHeader/AdminHeader";

export default function AdminLayout({ children }) {
    return (
        <div className={style.main}>
            <AdminHeader />
            <div className={style.container}>
                {children}
            </div>
        </div>
    )
}