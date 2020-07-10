const encodings = {
    '\+': "%2B",
    '\!': "%21",
    '\"': "%22",
    '\#': "%23",
    '\$': "%24",
    '\&': "%26",
    '\'': "%27",
    '\(': "%28",
    '\)': "%29",
    '\*': "%2A",
    '\,': "%2C",
    '\:': "%3A",
    '\;': "%3B",
    '\=': "%3D",
    '\?': "%3F",
    '\@': "%40",
};

export default function (filename: string): string {
    return encodeURI(filename) // Do the standard url encoding
        .replace(
            /([+!"#$&'()*+,:;=?@])/img,
            function (match) {
                return encodings[match];
            }
        );
}