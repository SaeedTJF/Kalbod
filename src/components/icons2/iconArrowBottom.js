export function IconArrowBottom({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cname}
      width={size}
      viewBox="0 0 24 24"
    >
      <g fill={color}>
        <path d="M12,18a1,1,0,0,1-.707-.293l-10-10A1,1,0,0,1,2.707,6.293L12,15.586l9.293-9.293a1,1,0,1,1,1.414,1.414l-10,10A1,1,0,0,1,12,18Z"></path>
      </g>
    </svg>
  );
}
