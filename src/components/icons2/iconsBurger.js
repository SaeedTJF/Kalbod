export function IconBurger({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cname}
      width={size}
      viewBox="0 0 24 24"
    >
      <g fill={color}>
        <line
          data-color="color-2"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          x1="1"
          y1="12"
          x2="23"
          y2="12"
          strokeLinejoin="miter"
        ></line>{" "}
        <line
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          x1="12"
          y1="5"
          x2="23"
          y2="5"
          strokeLinejoin="miter"
        ></line>{" "}
        <line
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          x1="1"
          y1="19"
          x2="12"
          y2="19"
          strokeLinejoin="miter"
        ></line>
      </g>
    </svg>
  );
}
