#!/usr/bin/env node
/**
 * smf command line tool
 */

var smf = require('smf'),
    service = process.argv[2];

if (service) {
  smf.svcs(service, function(err, svc) {
    if (err) throw err;
    console.log(JSON.stringify(svc));
  });
} else {
  smf.svcs(function(err, services) {
    if (err) throw err;
    console.log(services.join('\n'));
  });
}
