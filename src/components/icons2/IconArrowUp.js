export function IconArrowUp({ size, color, cname }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cname}
        width={size}
        viewBox="0 0 24 24"
      >
        <g fill={color}>
        <polyline fill="none" stroke={color} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points="22,17 12,7 2,17 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline>
        </g>
      </svg>
    );
  }