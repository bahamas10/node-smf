var exec = require('child_process').execFile;

var strsplit = require('strsplit');

module.exports = svcs;

/**
 * Exposes information from svcs(1)
 *
 * Supply a service name and a callback to get information about the service,
 * or just supply a callback to get a list of services on the machine.
 */
function svcs(service, cb) {
  if (typeof service === 'function') {
    cb = service;
    service = null;
  }

  // make command
  var args = service
           ? ['-lvp', service]
           : ['-aHo', 'state,fmri'];

  // make the call
  var child = exec('svcs', args, function(err, stdout, stderr) {
    var code = err && err.code || 0;
    if (err)
      return cb(err);
    if (!stdout)
      return cb(new Error('No Output'));

    var lines = stdout.trim().split('\n');

    // return the list of fmris if no service was specified
    if (!service) {
      var ret = [];
      lines.forEach(function(line) {
        var s = strsplit(line, undefined, 2);
        ret.push({
          state: s[0],
          fmri: s[1]
        });
      });
      cb(null, ret);
      return;
    }

    var ret = {};

    // parse the service output line-by-line
    lines.forEach(function(line) {
      var split = strsplit(line, undefined, 2);

      // Extract the key and the value
      var key = split[0];
      var value = split[1];

      // Key specific parsing
      switch (key) {
        case 'contract_id':
          value = parseInt(value, 10);
          break;
        case 'enabled':
          value = value === 'true';
          break;
        case 'state_time':
          value = new Date(value);
          break;
        case 'process':
          var sp = strsplit(value, undefined, 2);

          var obj = {
            pid: parseInt(sp[0], 10),
            cmd: sp[1]
          };

          value = obj;

          if (!ret[key])
            value = [value];

          break;
      }

      // Save the key:value. If the key already exists, make it an array
      ret[key] = ret[key] ? [].concat(ret[key], value) : value;
    });

    return cb(null, ret);
  });
  return child;
}
