import dateFormat from 'dateformat';


export function getUrl(path) {
    if (path.startsWith("http")) return path;
    return `${window.server}${path}`;
}

export function getDateTimeString(unixSeconds) {
    const timeStamp = unixSeconds * 1000;
    const date = new Date(timeStamp);
    return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
}

export function shortenAddress(address) {
    if (!address || typeof address !== 'string' || address.length !== 42) return '';
    return `${address.slice(0, 6)}...${address.slice(36)}`;
}