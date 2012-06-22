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
  // Check for arguments
  if (typeof service === 'function') {
    callback = service;
    service = null;
  }

  // Construct args
  var args = (service) ? ['-lv', service] : ['-a', '-H', '-o', 'fmri'];

  // Spawn the call
  spawn_process('svcs', args, function(err, out, code) {
    if (err) return callback(err, null);

    var ret;
    if (service) {
      var index, key, value;
      ret = {};
      // Parse the service output line-by-line
      out.trim().split('\n').forEach(function(line) {
        // I hate javascript 'split()', poor man fix
        index = line.match(/\s+/).index;

        // Extract the key and the value
        key = line.substr(0, index);
        value = line.substr(index).trim();

        // Save the key:value. If the key already exists, make it a list
        ret[key] = (ret[key]) ? [].concat(ret[key], value) : value;
      });
    } else {
      // Return the list of fmris
      ret = out.trim().split('\n');
    }
    return callback(null, ret);
  });
};

/**
 * Exposes information from svcadm(1M)
 */
module.exports.svcadm = function(action, service, options, callback) {
  var args, options = options || {};

  // Check for arguments
  if (!service) throw new Error('Not enough arguments supplied');
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    callback = callback || function() {};
  }

  // Construct args
  args = [action];
  if (options.temporary) args = args.concat('-t');
  if (options.wait) args = args.concat('-s');
  args = args.concat(service);

  // Spawn the call
  spawn_process('svcadm', args, function(err, out, code) {
    if (err) return callback(err, code);
    return callback(null, code);
  });
};

/**
 * Internal function to easily spawn a child
 * and get the stdout, stderr, and exit code
 */
function spawn_process(prog, args, callback) {
  var out = '',
      err = '',
      child = spawn(prog, args);

  child.stdout.on('data', function(data) {
    out += data;
  });
  child.stderr.on('data', function(data) {
    err += data;
  });

  child.on('exit', function(code) {
    return callback(err, out, code);
  });
}
