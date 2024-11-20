export function IconTrash ({size, color, cname}) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" className={cname} width={size} viewBox="0 0 32 32">
            <rect strokeOpacity="0.15"/>
            <path fill={"transparent"}
                d="M23.5 10.9833C20.725 10.7083 17.9333 10.5667 15.15 10.5667C13.5 10.5667 11.85 10.65 10.2 10.8167L8.5 10.9833"
                stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fill={"transparent"}
                d="M13.0835 10.1417L13.2668 9.04999C13.4002 8.25832 13.5002 7.66666 14.9085 7.66666H17.0918C18.5002 7.66666 18.6085 8.29166 18.7335 9.05832L18.9168 10.1417"
                stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fill={"transparent"}
                d="M21.7082 13.6167L21.1665 22.0083C21.0748 23.3167 20.9998 24.3333 18.6748 24.3333H13.3248C10.9998 24.3333 10.9248 23.3167 10.8332 22.0083L10.2915 13.6167"
                stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fill={"transparent"} d="M14.6084 19.75H17.3834" stroke={color} strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path fill={"transparent"} d="M13.9165 16.4167H18.0832" stroke={color} strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    )
}
