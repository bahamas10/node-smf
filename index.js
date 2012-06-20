/**
 * Expose smf(5) to Node.js for Solaris/Illumos based operating systems
 *
 * Wraps commands such as svcs(1) and svcadm(1M)
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * License: MIT
 */

var spawn = require('child_process').spawn;

/**
 * Exposes information from svcs(1)
 *
 * Supply a service name and a callback
 * to get information about the service,
 * or just supply a callback to get a list
 * of services on the machine.
 */
module.exports.svcs = function(service, callback) {
  var svcs, args, out = '', err = '';

  // Check for arguments
  if (typeof service === 'function') {
    callback = service;
    service = null;
  }

  // Construct args
  args = (service) ? ['-lv', service] : ['-a', '-H', '-o', 'fmri'];

  // Spawn the call
  svcs = spawn('svcs', args);
  svcs.stdout.on('data', function(data) {
    out += data;
  });
  svcs.stderr.on('data', function(data) {
    err += data;
  });

  svcs.on('exit', function(code) {
    if (err) return callback(err, null);

    if (service) {
      // Parse the service output line-by-line
      var index, key, value, ret = {};
      out.trim().split('\n').forEach(function(line) {
        // I hate javascript 'split()', poor man fix
        index = line.match(/\s+/).index;

        // Extract the key and the value
        key = line.substr(0, index);
        value = line.substr(index).trim();

        // Save the key:value. If the key already exists, make it a list
        ret[key] = (ret[key]) ? [].concat(ret[key], value) : ret[key] = value;
      });

      // Return the resultant object
      return callback(null, ret);
    } else {
      // Return the list of fmris
      return callback(null, out.trim().split('\n'));
    }
  });
};
