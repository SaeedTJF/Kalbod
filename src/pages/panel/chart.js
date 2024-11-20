import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import KhatmMonitoring from "@/components/Admin/AdminDashboard/KhatmMonitoring"

export default function PanelAdmin () {
    return (
        <AdminLayout>
            <KhatmMonitoring />
        </AdminLayout>
    )
}