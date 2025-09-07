# External Ingress

A Node.js service that synchronizes Counter-Strike 2 server information from external APIs and maintains a database of server for https://cs2browser.net.

## Overview

This service fetches CS2 server data from external APIs (currently CS2KZ), resolves server hostnames to IP addresses, enriches the data with geographical information using MaxMind version of DBIP databases, and stores the results in a MySQL database.

## Features

- **API Integration**: Syncs server data from CS2KZ API
- **DNS Resolution**: Converts server hostnames to IP addresses
- **Geolocation**: Uses MaxMind version of DBIP databases to get country and coordinates
- **Database Storage**: Stores server information with location data in MySQL
- **Caching**: In-memory cache to avoid duplicate entries
- **Automatic Updates**: Runs sync every 60 seconds

## Prerequisites

- Node.js
- MySQL database
- MaxMind version of DBIP databases (City IPv4 and IPv6)

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables (create `.env` file):
```env
MYSQL_URI="mysql://username:password@host:port/db_name"
```

3. Ensure MaxMind version of DBIP databases are in the `data/` directory:
   - `dbip-city-ipv4.mmdb`
   - `dbip-city-ipv6.mmdb`

4. Set up MySQL database with required table structure:
```sql
CREATE TABLE `ip_list` (
  `id` int(11) NOT NULL,
  `address` varchar(22) NOT NULL,
  `country` varchar(12) NOT NULL,
  `lat` float NOT NULL,
  `lon` float NOT NULL,
  `status` int(11) NOT NULL,
  `last_updated` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
```

## Usage

```bash
pnpm start
```

## How It Works

1. **Initialization**: Loads existing server addresses from database into cache
2. **API Sync**: Fetches server data from configured APIs
3. **Processing**: For each server:
   - Resolves hostname to IP address
   - Checks if already cached/processed
   - Looks up geographical information
   - Stores in database and cache
4. **Continuous Sync**: Repeats every 60 seconds

## License

MIT