import withPlugins from 'next-compose-plugins';
import withPWA from 'next-pwa';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'core.pod.ir',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pod.ir',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.iconscout.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '10.35.44.104',
                port: '8080',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'iconscout.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'podspace.pod.ir',
                port: '',
                pathname: '/**',
            },
            
        ],
    },
};

export default withPlugins([
    [withPWA, {
        pwa: {
            dest: 'public',
            register: true,
            skipWaiting: true,
            disable: process.env.NODE_ENV === 'development',
        },
    }],
], nextConfig);
