


export function IconClose({ size, color, cname }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cname}
            width={size}
            viewBox="0 0 24 24"
        >
            <g class="nc-icon-wrapper" fill={color} stroke-linejoin="miter" stroke-linecap="butt"><line fill="none" stroke={color} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="5" x2="5" y2="19" stroke-linejoin="miter"></line> <line fill="none" stroke={color} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="19" x2="5" y2="5" stroke-linejoin="miter"></line></g>
        </svg>
    );
}
