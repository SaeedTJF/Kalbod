export function IconDownload({ size, color, cname }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cname}
            width={size}
            viewBox="0 0 24 24"
            fill={color}
        >
           <g class="nc-icon-wrapper"  stroke-linejoin="miter" stroke-linecap="butt"><path d="M2,16v4a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V16" fill="none" stroke={color} stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path><line data-cap="butt" data-color="color-2" x1="12" y1="1" x2="12" y2="16" fill="none" stroke={color} stroke-miterlimit="10" stroke-width="2"></line><polyline data-color="color-2" points="7 11 12 16 17 11" fill="none" stroke={color} stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline></g>
        </svg>
    );
}
