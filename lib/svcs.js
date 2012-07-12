var autocast = require('autocast'),
    spawn_process = require('./lib').spawn_process;

/**
 * Exposes information from svcs(1)
 *
 * Supply a service name and a callback
 * to get information about the service,
 * or just supply a callback to get a list
 * of services on the machine.
 */
module.exports = function(service, callback) {
  // Check for arguments
  if (typeof service === 'function') {
    callback = service;
    service = null;
  }

  // Construct args
  var args = (service) ? ['-lvp', service] : ['-a', '-H', '-o', 'fmri'];

  // Spawn the call
  var child = spawn_process('svcs', args, function(err, out, code) {
    if (err || !out) return callback(err || 'No Output', null);

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
        value = autocast(line.substr(index).trim());

        // Key specific parsing
        switch (key) {
          case 'dependency':
            if (!ret[key]) value = [value];
            break;
          case 'process':
            var obj = {},
                i = value.indexOf(' ');
            obj.pid = +value.substr(0, i);
            obj.cmd = value.substr(i+1);
            value = obj;
            if (!ret[key]) value = [value];
            break;
        }

        // Save the key:value. If the key already exists, make it a list
        ret[key] = (ret[key]) ? [].concat(ret[key], value) : value;
      });
    } else {
      // Return the list of fmris
      ret = out.trim().split('\n');
    }
    return callback(null, ret);
  });
  return child;
};
