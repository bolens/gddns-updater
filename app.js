// TODO: make so it monitors public ip for a change, then update ip

'use strict';
require('dotenv').config();
const extIP = require('external-ip');
const request = require("request");
const moment = require('moment');
const userAgent = 'GDDNS Updater';
const updateInterval = 10000;
// const updateInterval = 900000; // 15 minutes
let currentIP = '0.0.0.0';


let getIP = extIP({
  replace: true,
  services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
  timeout: 600,
  getIP: 'parallel',
  userAgent: userAgent
});

setInterval(() => {
  getIP((err, ip) => {
    if (err) {
      throw err;
    }

    if (ip !== currentIP) {
      currentIP = ip;
      console.log( moment().format("YYYY-DD-MM hh:mm") + ' | Updating ip to: ' + ip);
      updateIP(ip);
    } else {
      console.log( moment().format("YYYY-DD-MM hh:mm") + ' | No update required.');
    }

  })
}, updateInterval);


function updateIP(ip) {
  let options = {
    method: 'POST',
    url: 'https://' + process.env.GDDNS_USER + ':' + process.env.GDDNS_PASS + '@domains.google.com/nic/update',
    qs: {
      hostname: process.env.GDDNS_HOST,
      myip: ip
    },
    headers: {
      'User-Agent': userAgent
    }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}
