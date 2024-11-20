{
  /* <polyline data-cap="butt" data-color="color-2" points="2 5 16 16 30 5" fill="none" stroke="#212121" stroke-miterlimit="10" stroke-width="2"></polyline> <rect x="1" y="4" width="30" height="24" rx="3" ry="3" fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect> */
}

export function IconEmail({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cname}
      width={size}
      viewBox="0 0 32 32"
    >
      <g fill={color}>
        <polyline
          data-cap="butt"
          data-color="color-2"
          points="2 5 16 16 30 5"
          fill="none"
          stroke={color}
          stroke-miterlimit="10"
          stroke-width="2"
        ></polyline>{" "}
        <rect
          x="1"
          y="4"
          width="30"
          height="24"
          rx="3"
          ry="3"
          fill="none"
          stroke={color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="2"
        ></rect>
      </g>
    </svg>
  );
}
