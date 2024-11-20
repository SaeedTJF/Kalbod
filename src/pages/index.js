import {useEffect} from "react";
import {useRouter} from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import {IconLoaderAnimated} from "@/components/Icons/iconLoaderAnimated";
export default function Index() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return (
        <DashboardLayout>
            <IconLoaderAnimated size={"48px"}/>
        </DashboardLayout>
    );
}
