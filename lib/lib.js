var spawn = require('child_process').spawn;

/**
 * Internal function to easily spawn a child
 * and get the stdout, stderr, and exit code
 */
module.exports.spawn_process = function(prog, args, callback) {
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

  return child;
};
