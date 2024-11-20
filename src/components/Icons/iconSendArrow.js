export function IconSendArrow ({size, color, cname}) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" className={cname} width={size} viewBox="0 0 12 14">
            <g fill={"none"}>
                <path d="M1 6L6 1L11 6M6 13V2" stroke={color} strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </g>
        </svg>
    )
}
