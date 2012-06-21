var svcadm = require('../').svcadm;

// disable nginx without wating or confirmation
svcadm('disable', 'nginx');

// enable nginx and callback with results
svcadm('enable', 'nginx', function(err, code) {
  if (err) throw err;
  console.log('Return code %d', code);
});

// disable nginx, wait for it to enter 'disabled' state, and callback
svcadm('disable', 'nginx', {wait:true}, function(err, code) {
  if (err) throw err;
  console.log('Return code %d', code);
});

// restart nginx without waiting or confirmation
svcadm('restart', 'nginx');

// temporarily disable nginx without waiting or confirmation
svcadm('disable', 'nginx', {temporary:true});
