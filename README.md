SMF - Service Management Facility
=================================

Expose smf(5) to Node.js for Solaris/Illumos based operating systems

Install
------

Install locally to use as a madule

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
on the system.

### smf.svcs('name', callback(err, svc))

Call `smf.svcs` with a service name and a callback to get information
about the given service.

Example
-------

``` js
var smf = require('smf');
smf.svcs(function(err, services) {
        if (err) throw err;
        console.log('%d services found.', services.length);
        console.log('Looking up last service found...');
        smf.svcs(services[services.length - 1], function(err, svc) {
                if (err) throw err;
                console.log(svc);
        });
});
```

    161 services found.
    Looking up last service found...
    { fmri: 'svc:/system/boot-archive:default',
        name: 'check boot archive content',
        enabled: 'true',
        state: 'online',
        next_state: 'none',
        state_time: 'Wed Apr 25 01:32:33 2012',
        logfile: '/var/svc/log/system-boot-archive:default.log',
        restarter: 'svc:/system/svc/restarter:default',
        dependency: 'require_all/none svc:/system/filesystem/root (online)' }

Command Line
------------

If you install this module globally you will also get the `smf`
tool to expose information from svcs(1).  Run it without
any arguments to get a newline separated list of service fmri's
on the system.  Run it with a service-name argument to get a json
object of information about the given service.

Example
-------

    root@dave.voxer.com# smf | tail -3
    svc:/milestone/devices:default
    svc:/system/device/local:default
    svc:/system/boot-archive:default
    root@dave.voxer.com# smf svc:/system/boot-archive:default | json -i
    { fmri: 'svc:/system/boot-archive:default',
        name: 'check boot archive content',
        enabled: 'true',
        state: 'online',
        next_state: 'none',
        state_time: 'Wed Apr 25 01:32:33 2012',
        logfile: '/var/svc/log/system-boot-archive:default.log',
        restarter: 'svc:/system/svc/restarter:default',
        dependency: 'require_all/none svc:/system/filesystem/root (online)' }

License
-------

MIT Licensed
