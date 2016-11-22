var express=require('express');
var app = express();
var server= require('http').Server(app);
var io=require('socket.io')(server);
var serialport = require('serialport');
//var SerialPort = serialport.SerialPort;

var port = new serialport("COM6", {
     baudrate: 9600,
     dataBits: 8,  
     parity: 'none',  
     stopBits: 1, 
     flowControl: false
});

port.on("open", onOpen);
port.on('error', onError);
port.on('data', onDataReceived);

io.on('connection', function (socket) {
  console.log("Alguien se conecto...");

    socket.on('new-message', function(cel,sms) {  
        //messages.push(data);
        //io.sockets.emit('messages', messages);
        //console.log(cel);
        if(port.isOpen()){
            eviarsms(port,cel,sms);
        }
    });
});

function onOpen(error) {
    if(!error){
        console.log('Port open sucessfully');
    }
}

function onDataReceived(data){
    console.log("Received data: " + data);
}

function onError(error){
    console.log(error);
}

function onClose(error){
    console.log('Closing connection');
    console.log(error);
}

function eviarsms(serial, toAddress, message) {
    serial.write("AT+CMGF=1");
    serial.write('\r');
    serial.write("AT+CMGS=\"");
    serial.write(toAddress);
    serial.write('"')
    serial.write('\r');
    serial.write(message); 
    serial.write(Buffer([0x1A]));
    serial.write('^z');
}

function read(serial){
    serial.write("AT+CMGF=1");
    serial.write('\r');
    serial.write("AT+CPMS=\"SM\"");
    serial.write('\r');
    serial.write("AT+CMGL=\"ALL\"");
    serial.write('\r');
}

app.use(express.static(__dirname + '/bower_components'));

app.get('/',function(req,res){
    res.sendfile(__dirname + '/index.html');
});


server.listen(8000,function(){
    console.log("el servidor arranco en %s",app.settings.env);
});

