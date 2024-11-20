
import { ChatProvider } from '@/contexts/ChatContext';
import axios from 'axios';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AccessDenied from "@/components/Extra/AccessDenied";
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function MyApp({ Component, pageProps }) {
    const [userData, setUserData] = useState(null);
    const [isadmin, setisadmin] = useState(0)
    //  0 off dont show component
    // 1 is admin = true
    // 2 is admin = false
    const router = useRouter()
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');

        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            let User = ''
            axios.get(`${API_BASE_URL}verify_user/`, {
                headers: {
                    'Authorization': parsedUserData.token,
                    'Content-Type': 'application/json',
                }
            }).then(resp => {
                User = resp.data
                localStorage.setItem('userData',JSON.stringify(User))
                if (router.asPath.startsWith('/panel')) {
                    if (User) {
                        if (User.is_admin) {
                            setisadmin(1)
                        } else {
                            setisadmin(2)
                        }
                    }
                    else {
                        setisadmin(2)
                    }
                } else {
                    setisadmin(1)
                }
            }).catch(err => {
                setisadmin(1)
                //localStorage.clear()
                // window.location.href = 'http://10.35.44.104:8080/login';
            })

        }else {
            setisadmin(1)
            if (router.asPath.startsWith('/panel')) {
                setisadmin(2)
                //localStorage.clear()
                return
            }
            router.push('/')
        }
    }, [router.asPath])
    return (
        <>
            {isadmin == 1 && <ChatProvider>
                <Component {...pageProps} />
            </ChatProvider>
            }
            {isadmin == 2 && <AccessDenied />}</>

    );
}

export default MyApp;
