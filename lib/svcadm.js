var spawn_process = require('./lib').spawn_process;

/**
 * Exposes information from svcadm(1M)
 */
module.exports = function(action, service, options, callback) {
  options = options || {};

  // Check for arguments
  if (!service) throw new Error('Not enough arguments supplied');
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    callback = callback || function() {};
  }

  // Construct args
  var args = [action];
  if (options.temporary) args.push('-t');
  if (options.wait) args.push('-s');
  args.push(service);

  // Spawn the call
  var child = spawn_process('svcadm', args, function(err, out, code) {
    if (err) return callback(err, code);
    return callback(null, code);
  });
  return child;
};
