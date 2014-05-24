#!/usr/bin/env node
/**
 * smf command line tool
 */

var smf = require('../');
var exec = require('child_process').exec;
var action = process.argv[2];
var service = process.argv[3];

// Check arguments
if (!action) {
  // No arguments supplied, just list services on system
  smf.svcs(function(err, services) {
    if (err)
      throw err;
    services.forEach(function(a) {
      console.log(a.fmri);
    });
  });
  return;
} else if (!service) {
  // Only 1 argument found, assume it is the service
  service = action;
  smf.svcs(service, function(err, svc) {
    if (err)
      throw err;
    console.log(JSON.stringify(svc, null, 2));
  });
  return;
}

// Find the appropriate action
switch (action) {
  case 'tail':
  case 'log':
  case '-L':
    // Tail the log
    smf.svcs(service, function(err, svc) {
      if (err || !svc.logfile)
        throw err;
      console.log(svc.logfile);
      if (action === '-L') return 0;
      exec('tail -20 '+svc.logfile, function(err, stdout, stderr) {
        if (err)
          throw err;
        console.log(stdout);
      });
    });
    break;
  default:
    console.error('Unsupported Action');
    process.exit(1);
    break;
}
