var autocast = require('autocast');
var exec = require('exec');
var strsplit = require('strsplit');

/**
 * Exposes information from svcs(1)
 *
 * Supply a service name and a callback
 * to get information about the service,
 * or just supply a callback to get a list
 * of services on the machine.
 */
module.exports = function(service, cb) {
  // Check for arguments
  if (typeof service === 'function') {
    cb = service;
    service = null;
  }

  // Construct args
  var args = (service) ? ['-lvp', service] : ['-a', '-H', '-o', 'fmri'];

  // Spawn the call
  var child = exec(['svcs'].concat(args), function(err, out, code) {
    if (err || !out) return cb(err || 'No Output');

    var lines = out.trim().split('\n');

    // Return the list of fmris
    if (!service)
      return cb(null, lines);

    var ret = {};
    // Parse the service output line-by-line
    lines.forEach(function(line) {
      // I hate javascript 'split()', poor man fix
      var split = strsplit(line, undefined, 2);

      // Extract the key and the value
      var key = split[0];
      var value = autocast(split[1]);

      // Key specific parsing
      switch (key) {
        case 'dependency':
          if (!ret[key]) value = [value];
          break;
        case 'process':
          var obj = {};
          if (typeof value === 'string') {
            // Process has pid and name
            var i = value.indexOf(' ');
            obj.pid = +value.substr(0, i);
            obj.cmd = value.substr(i+1);
          } else {
            // Process only has pid
            obj.pid = value;
          }
          value = obj;
          if (!ret[key]) value = [value];
          break;
      }

      // Save the key:value. If the key already exists, make it a list
      ret[key] = ret[key] ? [].concat(ret[key], value) : value;
    });

    return cb(null, ret);
  });
  return child;
};
