#!/usr/bin/env node
var svcs = require('../').svcs;

svcs(function(err, services) {
  // services => list of fmri's on the system
  console.log(services);
});

svcs('nginx', function(err, svc) {
  // svc => an associative array of service information
  console.log(svc);
});
