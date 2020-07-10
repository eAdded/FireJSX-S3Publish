import Link from "firejsx/Link.js";
import S3Encode from "./S3Encode.js";

export default ({href, children, ...extra}) => {
    return (
        <Link href={S3Encode(href)} {...extra}>
            {children}
        </Link>
    )
}