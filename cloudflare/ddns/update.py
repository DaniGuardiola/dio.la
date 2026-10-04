#!/usr/bin/env python3
"""Update only home.dio.la and pi4.dio.la using a zone-scoped token."""
import ipaddress
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ZONE = "20366c15a907eec5f21d6210b4acf769"
NAMES = ("home.dio.la", "pi4.dio.la")
CONFIG = Path.home() / ".config/cloudflare-ddns/credentials.json"


def request(url, token=None, data=None, method="GET"):
    headers = {"User-Agent": "dio-la-ddns/1.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if data is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(data).encode()
    req = urllib.request.Request(url, headers=headers, data=data, method=method)
    with urllib.request.urlopen(req, timeout=20) as response:
        return response.read().decode()


def main():
    token = json.loads(CONFIG.read_text())["token"]
    # An IPv4-only endpoint prevents IPv6 discovery from changing A records.
    address = ipaddress.IPv4Address(request("https://api4.ipify.org").strip())
    if not address.is_global:
        raise ValueError("Public IPv4 discovery returned a non-global address")
    api = f"https://api.cloudflare.com/client/v4/zones/{ZONE}/dns_records"
    for name in NAMES:
        query = urllib.parse.urlencode({"type": "A", "name": name})
        payload = json.loads(request(f"{api}?{query}", token))
        if not payload.get("success") or len(payload.get("result", [])) != 1:
            raise ValueError(f"Expected exactly one A record for {name}")
        record = payload["result"][0]
        if record["name"] != name or record["type"] != "A" or record["proxied"]:
            raise ValueError(f"Unexpected DNS configuration for {name}")
        if record["content"] == str(address):
            print(f"{name}: unchanged ({address})")
            continue
        result = json.loads(request(f'{api}/{record["id"]}', token,
                                    {"content": str(address)}, "PATCH"))
        if not result.get("success"):
            raise ValueError(f"DNS update failed for {name}")
        print(f"{name}: updated to {address}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, urllib.error.URLError) as error:
        print(f"DDNS failed: {error}", file=sys.stderr)
        sys.exit(1)
