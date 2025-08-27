import dns from 'dns/promises'

export async function GetIPFromDNS(dnssrv: string) {
    try {
        const result = await dns.resolve4(dnssrv);
        return result[0];
    } catch (error) {
        return dnssrv;
    }
}