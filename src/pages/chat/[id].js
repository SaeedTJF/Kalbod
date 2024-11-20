import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import ChatConversation from "@/components/ChatConversation/ChatConversation";

export default function Dashboard () {
    return (
        <DashboardLayout>
            <ChatConversation />
        </DashboardLayout>
    )
}