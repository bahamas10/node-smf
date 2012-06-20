#!/usr/bin/env node
var smf = require('../');

smf.svcs(function(err, services) {
  if (err) throw err;
  console.log('%d services found.', services.length);
  console.log('Looking up last service found...');
  smf.svcs(services[services.length - 1], function(err, svc) {
    if (err) throw err;
    console.log(svc);
  });
});
