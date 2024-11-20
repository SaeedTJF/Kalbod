 

export function IconPost({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cname}
      width={size}
      viewBox="0 0 24 24"
    >
      <g fill={color}>
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="2"
          ry="2"
          fill="none"
          stroke={color}
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        ></rect>
        <line
          data-color="color-2"
          x1="12"
          y1="7"
          x2="12"
          y2="17"
          fill="none"
          stroke={color}
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        ></line>
        <line
          data-color="color-2"
          x1="17"
          y1="12"
          x2="7"
          y2="12"
          fill="none"
          stroke={color}
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        ></line>
      </g>
    </svg>
  );
}
