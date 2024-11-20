import { useEffect } from "react";
import { useRouter } from "next/router";


export default function OutProcess() {
    const router = useRouter();

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');

        if (storedUserData) {
            router.push('/');
        } else {
            router.push('/');
        }
    }, [router]);

    return (
       <>
           <span>Transferring into home...</span>
       </>
    );
}
