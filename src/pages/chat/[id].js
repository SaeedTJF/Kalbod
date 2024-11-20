import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import ChatConversationHistory from "@/components/ChatConversation/ChatConversationHistory";

export default function ChatPage() {
    return (
        <DashboardLayout>
            <ChatConversationHistory />
        </DashboardLayout>
    );
}
