SMF - Service Management Facility
=================================

Expose smf(5) to Node.js for Solaris/Illumos based operating systems

Install
------

Install locally to use as a module

    npm install smf

Install globally to use the command-line tool `smf`

    npm install -g smf

Usage
-----

as a module

``` js
var smf = require('smf');
```

as a command-line tool

    ~$ smf [ service-name ]

Functions
---------

### smf.svcs(callback(err, services))

Call `smf.svcs` with a single callback argument to get a list of service fmri's
and states on the system.

### smf.svcs('name', callback(err, svc))

Call `smf.svcs` with a service name and a callback to get information
about the given service.

---

### smf.svcadm('action', 'name')

Do a given action to the given name.  For example `smf.svcadm('disable', 'apache');`.
This command will return immediately, without waiting for the service to be disabled
fully, and without checking error codes.

### smf.svcadm('action', 'name', {option:value}, callback(err, code))

Do a given action to the given name with additional options.  When the
command is finished the callback will be called with an error message
(or null) as the first argument, and the exit code of the svcadm(1M)
call.

_Options_

1.  `{temporary:true}` - Temporarily disable or enable a service
2.  `{wait:true}` - Wait for the service to change state before executing `callback`

Options and callbacks are optional. See EXAMPLES for more information.

Example
-------

### smf.svcs()

get a list of all services and their states

``` js
var svcs = require('smf').svcs;
svcs(function(err, services) {
  // services => list of all service fmri's on the system
});
```

yields

``` js
[ { state: 'legacy_run', fmri: 'lrc:/etc/rc2_d/S98deallocate' },
  { state: 'legacy_run', fmri: 'lrc:/etc/rc2_d/S89PRESERVE' },
  { state: 'legacy_run', fmri: 'lrc:/etc/rc2_d/S72autoinstall' },
  { state: 'legacy_run', fmri: 'lrc:/etc/rc2_d/S20sysetup' },
  { state: 'disabled', fmri: 'svc:/pkgsrc/denyhosts:default' },
  { state: 'online',
    fmri: 'svc:/application/splunk:default' },
  { state: 'disabled', fmri: 'svc:/network/denyhosts:default' },
  { state: 'disabled',
    fmri: 'svc:/application/testing/nginx:default' },
...
]
```

get information about a specific service

``` js
svcs('boot-archive', function(err, svc) {
  // svc => associative array of service information
});
```

yields

```
{ fmri: 'svc:/system/boot-archive:default',
  name: 'check boot archive content',
  enabled: true,
  state: 'online',
  next_state: 'none',
  state_time: 'Wed Apr 25 01:32:33 2012',
  logfile: '/var/svc/log/system-boot-archive:default.log',
  restarter: 'svc:/system/svc/restarter:default',
  dependency: [ 'require_all/none svc:/system/filesystem/root (online)' ] }
```

### smf.svcadm()

``` js
var svcadm = require('smf').svcadm;

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
```

Command Line
------------

If you install this module globally you will also get the `smf`
tool to expose information from svcs(1).  Run it without
any arguments to get a newline separated list of service fmri's
on the system.  Run it with a service-name argument to get a json
object of information about the given service.

Inspired by the smf bash script by [@dshaw][dshaw].

Example
-------

Get a list of fmri's on the system

    root@dave.voxer.com# smf | tail -3
    svc:/milestone/devices:default
    svc:/system/device/local:default
    svc:/system/boot-archive:default

Get information about the nginx service

    root@dave.voxer.com# smf nginx | json

``` json
{
  "fmri": "svc:/network/nginx:default",
  "name": "Nginx 1.0.12",
  "enabled": true,
  "state": "online",
  "next_state": "none",
  "state_time": "May  4, 2012 07:45:13 PM PDT",
  "logfile": "/var/svc/log/network-nginx:default.log",
  "restarter": "svc:/system/svc/restarter:default",
  "contract_id": 68,
  "dependency": [
    "require_all/none svc:/system/filesystem/local (online)",
    "require_all/none svc:/network/loopback (online)"
  ],
  "process": [
    {
      "pid": 568,
      "cmd": "/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf"
    },
    {
      "pid": 569,
      "cmd": "/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf"
    }
  ]
}
```

Get the logs from a service (easier than `tail -20 "$(svcs -L <service>)"`)

    root@dave.voxer.com# smf tail name-services
    /var/svc/log/milestone-name-services:default.log
    [ Apr 25 01:32:33 Enabled. ]
    [ Apr 25 01:32:35 Executing start method (null). ]

    root@dave.voxer.com# smf -L name-services
    /var/svc/log/milestone-name-services:default.log

License
-------

MIT Licensed


[dshaw]: https://github.com/dshaw
