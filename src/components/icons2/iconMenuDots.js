export function IconMenuDots ({size, color, cname}) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" className={cname} width={size} viewBox="0 0 24 24">
            <g fill={color}>
                <circle cx="2" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="22" cy="12" r="2"></circle>
            </g>
        </svg>
    )
}
