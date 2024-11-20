import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { IconLoaderAnimated } from "@/components/Icons/iconLoaderAnimated";
import Home from "@/components/Home/Home";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');

        if (storedUserData) {
            router.push('/dashboard');
        } else {
            console.log("login Requirement")
        }
    }, [router]);

    return (
        <Home />
    );
}
