import { serverCache } from "../cache";
import { DoQuery } from "../db/connection";
import { GetIPFromDNS } from "../servers/dns";
import { GetIPInfo } from "../servers/mmdbreader";

interface CS2KZ_API {
    total: number;
    values: {
        id: number;
        name: string;
        host: string;
        port: number;
        owner: {
            id: string;
            name: string;
        };
        approved_at: string;
    }[];
}

const hideIps = [
    "127.0.0.1"
]

export default async function CS2KZAPI(json_data: any) {
    const data: CS2KZ_API = json_data as CS2KZ_API;

    for (const server of data.values) {
        const ip = await GetIPFromDNS(server.host)

        const address = ip + ":" + server.port
        if (hideIps.includes(ip) || serverCache.has(address)) continue;

        const locationInfo = GetIPInfo(ip);
        if (!locationInfo) continue;

        serverCache.add(address);
        DoQuery("insert into `ip_list` (`address`, `country`, `lat`, `lon`, `status`) values (?, ?, ?, ?, ?)", [address, locationInfo.country, locationInfo.lat, locationInfo.lon, 0])
    }
}