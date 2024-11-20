import Image from "next/image";

export function Logo ({size, color, cname}) {
    return(
      <Image src={'/src/logo.png'}  width={100} height={50}/>
    )
}
