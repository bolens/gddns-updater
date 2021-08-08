'use strict';
require('dotenv').config();
const publicIp = require('public-ip');
const fetch = require('node-fetch');
const moment = require('moment');

const logSymbols = require('log-symbols');
const timeFormat = "YYYY-DD-MM hh:mm";
const userAgent = 'GDDNS Updater';
const updateInterval = process.env.GDDNS_INT; // 900000 = 15 minutes

let currentIP = {
  v4: null,
  v6: null
};

let getIP = async () => {
  let ip = {
    v4: null,
    v6: null
  };

  ip.v4 = await publicIp.v4();
  ip.v6 = await publicIp.v6();

  return ip;
};

startCheck();
setInterval(() => {
  startCheck();
}, updateInterval);

function startCheck() {
  let ip = getIP();

  if (ip !== currentIP) {
    currentIP = ip;
    console.info(`${logSymbols.info} ${(moment().format(timeFormat))} | Updating IP to: ${ip.v4}`);
    updateIP(ip.v4);
  } else {
    console.info( `${logSymbols.info} ${moment().format(timeFormat)} | No update required.`);
  }
}

function updateIP(newIp) {
  const url = `https://${process.env.GDDNS_USER}:${process.env.GDDNS_PASS}@domains.google.com/nic/update`;
  let options = {
    method: 'POST',
    qs: {
      hostname: process.env.GDDNS_HOST,
      myip: newIp
    },
    headers: {
      'User-Agent': userAgent
    }
  };
  fetch(url, options)
    .then(res => console.log(res))
    .then(body => {
      console.log(body);
      console.log(`${logSymbols.success} Updated successfully`)
    })
    .catch(err => {
      console.error(err)
    });
}
