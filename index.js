/**
 * Expose smf(5) to Node.js for Solaris/Illumos based operating systems
 *
 * Wraps commands such as svcs(1) and svcadm(1M)
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * License: MIT
 */

module.exports.svcadm = require('./lib/svcadm');
module.exports.svcs = require('./lib/svcs');
