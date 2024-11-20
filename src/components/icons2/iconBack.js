export function IconBack ({size, color, cname}) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" className={cname} width={size} viewBox="0 0 24 24">
            <g class="nc-icon-wrapper" fill={color} stroke-linejoin="miter" stroke-linecap="butt"><line data-cap="butt" data-color="color-2" fill="none" stroke={color} stroke-width="2" stroke-miterlimit="10" x1="18" y1="12" x2="7" y2="12" stroke-linejoin="miter" stroke-linecap="butt"></line> <polyline data-color="color-2" fill="none" stroke={color} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points=" 11,16 7,12 11,8 " stroke-linejoin="miter"></polyline> <circle fill="none" stroke={color} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" cx="12" cy="12" r="11" stroke-linejoin="miter"></circle></g>
        </svg>
    )
}
