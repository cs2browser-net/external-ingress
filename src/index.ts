import { config } from "dotenv";
import { APIKind } from "./kinds";
import axios from "axios";
import CS2KZAPI from "./apis/cs2kz";
import { DoQuery } from "./db/connection";
import { serverCache } from "./cache";

const mappedAPIs = {
	"https://api.cs2kz.org/servers": APIKind.CS2KZ
};

config()

const LoadInfo = async () => {
	const rows = await DoQuery("select * from `ip_list`");

	for (const row of rows) {
		serverCache.add(row.address)
	}
}

const SyncAPIServers = async () => {
	for (const [url, kind] of Object.entries(mappedAPIs)) {
		const request = await axios.get(url)
		const data = request.data

		if (kind == APIKind.CS2KZ) await CS2KZAPI(data)
	}
}

(async () => {
	await LoadInfo()
	await SyncAPIServers()
	setInterval(SyncAPIServers, 60000)
})()