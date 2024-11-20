import ManageSession from "@/components/Panel/ManageSession";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";

export default function session() {
    return (
        <AdminLayout>
            <ManageSession />
        </AdminLayout>
    )
}