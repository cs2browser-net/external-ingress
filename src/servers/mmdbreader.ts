// @ts-expect-error
import MMDBReader from 'mmdb-reader'

const reader = new MMDBReader("data/dbip-city-ipv4.mmdb")

export function GetIPInfo(ip: string) {
    const ipaddr = reader.lookup(ip)
    if (!ipaddr) return null;

    const country = (ipaddr.country_code ?? "unknown").toLowerCase()
    const lat = (ipaddr.latitude || 0.0)
    const lon = (ipaddr.longitude || 0.0)

    return { country, lat, lon }
}