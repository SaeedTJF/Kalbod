{
  /* <g class="nc-icon-wrapper" fill="#212121" stroke-linejoin="miter" stroke-linecap="butt"><rect x="2" y="2" width="28" height="28" rx="3" ry="3" fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect><rect data-color="color-2" x="7" y="7" width="6" height="6" fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect><rect data-color="color-2" x="19" y="7" width="6" height="6" fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect><rect data-color="color-2" x="7" y="19" width="6" height="6" fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect><rect data-color="color-2" x="19" y="19" width="6" height="6" fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></rect></g> */
}

import React from "react";

export default function IconCategory({ size, color, cname }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      className={cname}
      viewBox="0 0 24 24"
    >
      <g strokeLinejoin="miter" strokeLinecap="butt">
        <rect
          x="1"
          y="4"
          width="30"
          height="24"
          rx="3"
          ry="3"
          stroke={color}
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        ></rect>
        <line
          data-cap="butt"
          x1="18"
          y1="4"
          x2="18"
          y2="28"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="2"
        ></line>
        <line
          data-color="color-2"
          x1="22"
          y1="11"
          x2="27"
          y2="11"
          stroke={color}
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        ></line>
        <line
          data-color="color-2"
          x1="22"
          y1="16"
          x2="27"
          y2="16"
          stroke={color}
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        ></line>
        <line
          data-color="color-2"
          x1="22"
          y1="21"
          x2="27"
          y2="21"
          stroke={color}
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        ></line>
      </g>
    </svg>
  );
}
