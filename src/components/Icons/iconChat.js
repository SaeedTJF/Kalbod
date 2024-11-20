export function IconChat ({size, color, cname}) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" className={cname} width={size} viewBox="0 0 24 24">
            <g fill={"transparent"}>
                <path
                    d="M10.0002 18.3333C14.6025 18.3333 18.3335 14.6024 18.3335 9.99999C18.3335 5.39762 14.6025 1.66666 10.0002 1.66666C5.39779 1.66666 1.66683 5.39762 1.66683 9.99999C1.66683 11.3331 1.97984 12.593 2.53638 13.7104C2.68428 14.0073 2.7335 14.3467 2.64776 14.6672L2.15142 16.5222C1.93596 17.3275 2.67267 18.0642 3.47795 17.8487L5.33298 17.3524C5.65344 17.2666 5.99284 17.3159 6.28977 17.4638C7.40713 18.0203 8.66709 18.3333 10.0002 18.3333Z"
                    stroke={color} strokeWidth="1.5"/>
                <path d="M6.6665 8.75H13.3332" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6.6665 11.6667H11.2498" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
            </g>
        </svg>
    )
}
