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
  var wantArray = true;

  if (typeof service === 'function') {
    cb = service;
    service = null;
  }

  if (service && !Array.isArray(service)) {
    wantArray = false;
    service = [service];
  }

  if (Array.isArray(service) && service.length === 0) {
    service = null;
  }

  // make command
  var args = service
           ? ['-lvp'].concat(service)
           : ['-aHo', 'state,fmri'];

  var ret = [];

  // make the call
  var child = exec('svcs', args, function(err, stdout, stderr) {
    if (err)
      return cb(err);
    if (!stdout)
      return cb(new Error('No Output'));

    // return the list of fmris if no service was specified
    if (!service) {
      var lines = stdout.trim().split('\n');
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

    // when passing in multiple service names each section is split by 2 new lines
    var sections = stdout.trim().split('\n\n');

    // each section is the output for a single service
    sections.forEach(function (section) {
      var lines = section.split('\n');
      var service = {};
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
        service[key] = service[key] ? [].concat(service[key], value) : value;
      });

      ret.push(service);

    });

    return cb(null, wantArray ? ret : ret[0]);

  });
  return child;
}
