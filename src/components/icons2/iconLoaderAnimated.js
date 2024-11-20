export function IconLoaderAnimated ({size, color, cname}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cname} width={size} viewBox="0 0 100 100" >
          <circle fill="#005b31" stroke="none" cx="6" cy="50" r="6">
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>
          </circle>
                    <circle fill="#005b31" stroke="none" cx="26" cy="50" r="6">
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>
          </circle>
                    <circle fill="#005b31" stroke="none" cx="46" cy="50" r="6">
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>
          </circle>
        </svg>
    )
}
