var execFile = require('child_process').execFile;

/**
 * Exposes information from svcadm(1M)
 */
module.exports = function(action, service, opts, cb) {
  if (!service)
    throw new Error('Not enough arguments supplied');

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  cb = cb || function() {};

  // make the command
  var args = [action];
  if (opts.temporary)
    args.push('-t');
  if (opts.wait)
    args.push('-s');
  args.push(service);

  // spawn the call
  var child = execFile('svcadm', args, function(err, stdout, stderr) {
    var code = err && err.code || 0;
    if (err)
      return cb(err, code);
    return cb(null, code);
  });
  return child;
};
