export function IconBlogCategory({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cname}
      width={size}
      viewBox="0 0 24 24"
    >
      <path
        d="M3,21V11L12,2l9,9v10c0,1.105-.895,2-2,2H5c-1.105,0-2-.895-2-2Z"
        fill="none"
        stroke={color}
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></path>
      <line
        data-color="color-2"
        x1="8"
        y1="18"
        x2="16"
        y2="18"
        fill="none"
        stroke={color}
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></line>
      <circle
        data-color="color-2"
        cx="12"
        cy="11"
        r="2"
        fill="none"
        stroke={color}
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></circle>
    </svg>
  );
}
