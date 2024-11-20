export function IconPhone({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cname}
      width={size}
      viewBox="0 0 24 24"
    >
      <g fill={color}>
        <path
          d="M14.308,15.191,12.167,17.3a17.411,17.411,0,0,1-3.092-2.376A17.607,17.607,0,0,1,6.7,11.834L8.81,9.693a.918.918,0,0,0,.189-1L6.8,3.56a.918.918,0,0,0-1.078-.525L1.688,4.1A.919.919,0,0,0,1,5.019,19.4,19.4,0,0,0,6.49,17.511,19.4,19.4,0,0,0,18.986,23a.917.917,0,0,0,.917-.688l1.066-4.036a.917.917,0,0,0-.524-1.078L15.316,15A.917.917,0,0,0,14.308,15.191Z"
          fill="none"
          stroke={color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="2"
        ></path>
        <path
          data-color="color-2"
          d="M14,1a9,9,0,0,1,9,9"
          fill="none"
          stroke={color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="2"
        ></path>
        <path
          data-color="color-2"
          d="M14,5a5,5,0,0,1,5,5"
          fill="none"
          stroke={color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="2"
        ></path>
      </g>
    </svg>
  );
}
