import style from './Monitoring.module.css';
import PieChart from "@/components/Charts/PieChart";
import React from "react";
import KhatmMonitoring from "@/components/Admin/AdminDashboard/KhatmMonitoring"

import CpuChart from "@/components/Charts/CpuChart";
export default function AdminMonitoring () {
    return (
        <div className={`${style.dashboard} ${style.monitoring}`}>
            <KhatmMonitoring />
        </div>
    )
}