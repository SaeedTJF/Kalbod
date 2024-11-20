import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useChat } from '@/contexts/ChatContext';

export default function LoginPage() {
    const router = useRouter();
    const { token } = router.query;
    const { setUserData } = useChat();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getUser/`, {
                headers: {
                    Authorization: `${token}`
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                })
                .then(data => {
                    setUserData(data);
                    localStorage.setItem('userData', JSON.stringify(data));
                    setLoading(false);
                    router.push('/dashboard'); // ریدایرکت به /dashboard
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                    setLoading(false);
                    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`; // ریدایرکت به URL خارجی
                });
        }
    }, [token]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Login Page</h1>
            <p>Token: {token}</p>
        </div>
    );
}
