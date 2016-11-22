var serialport = require('serialport');

serialport.list(function (err, ports) {
  ports.forEach(function(p) {
    console.log(p.comName);
    console.log(p.pnpId);
    console.log(p.manufacturer);
  });
});