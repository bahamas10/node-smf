#!/usr/bin/env node
/**
 * smf command line tool
 */

var smf = require('smf'),
    exec = require('child_process').exec,
    action = process.argv[2],
    service = process.argv[3];

// Check arguments
if (!action) {
  // No arguments supplied, just list services on system
  smf.svcs(function(err, services) {
    if (err) throw err;
    console.log(services.join('\n'));
  });
  return 0;
} else if (!service) {
  // Only 1 argument found, assume it is the service
  service = action;
  smf.svcs(service, function(err, svc) {
    if (err) throw err;
    console.log(JSON.stringify(svc, null, '  '));
  });
  return 0;
}

// Find the appropriate action
switch (action) {
  case 'tail':
  case 'log':
  case '-L':
    // Tail the log
    smf.svcs(service, function(err, svc) {
      if (err || !svc.logfile) throw err;
      console.log(svc.logfile);
      if (action === '-L') return 0;
      exec('tail -20 '+svc.logfile, function(err, stdout, stderr) {
        if (err) throw err;
        console.log(stdout);
      });
    });
    break;
  default:
    console.error('Unsupported Action');
    break;
}
