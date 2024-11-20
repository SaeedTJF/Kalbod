export function IconTrash({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cname}
      width={size}
      viewBox="0 0 24 24"
    >
      <g fill={color}>
        <path
          d="M3.87,21.214A3.01,3.01,0,0,0,6.862,24H17.138a3.01,3.01,0,0,0,2.992-2.786L21.074,8H2.926Z"
         
        ></path>
        <path
          data-color="color-2"
          d="M23,4H17V1a1,1,0,0,0-1-1H8A1,1,0,0,0,7,1V4H1A1,1,0,0,0,1,6H23a1,1,0,0,0,0-2ZM9,2h6V4H9Z"
        ></path>
      </g>
    </svg>
  );
}
