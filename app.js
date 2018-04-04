// TODO: make so it monitors public ip for a change, then update ip

'use strict';
require('dotenv').config();
const extIP = require('external-ip');
const request = require("request");
const userAgent = 'GDDNS Updater';

let getIP = extIP({
  replace: true,
  services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
  timeout: 600,
  getIP: 'parallel',
  userAgent: userAgent
});

getIP((err, ip) => {
  if (err) {
    throw err;
  }
  updateIP(ip);
});

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
