# Home dynamic DNS

The Pi4 runs this updater as the `dani` systemd user. User lingering is enabled,
so the five-minute timer runs without an interactive login and after reboot.
It discovers public IPv4 over HTTPS and updates only the existing, unproxied
`home.dio.la` and `pi4.dio.la` A records. It preserves all other record fields,
skips unchanged addresses, and fails without modifying DNS when discovery or
record validation fails. No old updater was found in Pi services, containers,
or root/user cron jobs.

Installed paths:

- `~/.local/bin/cloudflare-ddns.py`
- `~/.config/systemd/user/cloudflare-ddns.service`
- `~/.config/systemd/user/cloudflare-ddns.timer`
- `~/.config/cloudflare-ddns/credentials.json` (mode 0600, directory 0700)

The credential JSON contains a `token` field. The Cloudflare token named
`pi4 dio.la DDNS` grants DNS Edit only for the dio.la zone; its value is not
stored in this repository. Cloudflare token scope cannot restrict individual
records, so the updater enforces the two allowed names.

After copying the script and units and provisioning the private credential:

```sh
systemctl --user daemon-reload
systemctl --user enable --now cloudflare-ddns.timer
systemctl --user start cloudflare-ddns.service
systemctl --user show cloudflare-ddns.service -p Result -p ExecMainStatus
systemctl --user list-timers cloudflare-ddns.timer
```

Initial live verification found both records already equal to the Pi's public
IPv4; the service completed successfully without changing their addresses.
