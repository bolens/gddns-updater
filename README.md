# gddns-updater

Google Domains Dynamic DNS Updater.

Checks your public IP address at a specified interval. Recommended interval is `900000`, or 15 minutes.

## Install instructions

- `npm i`
- Add `.env` file with your domain info, for example:

```env
GDDNS_INTERVAL=CHECK_INTERVAL_IN_MILLISECONDS
GDDNS_USER=YOUR_HOST_USERNAME
GDDNS_PASS=YOUR_HOST_PASSWORD
GDDNS_HOST=YOUR_HOST
```

- Run `npm start`
