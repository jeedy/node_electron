'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const fs = require('fs');
const HOME_URL = 'file://+'+__dirname+'/index.html';

var win;
app.on('ready', function(){
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadURL(HOME_URL);

    win.on('closed', function(){
        win = null;
    });

    // Open the DevTools.
    win.webContents.openDevTools()
});

// 동기적 메시지 수신
ipc.on('mul-sync', function(event, arg){
    console.log(arg);
    event.returnValue = arg.a * arg.b;
});

// 비동기적 메시지 수신
ipc.on('mul-async', function(event, arg){
    console.log(arg);

    var result = arg.a * arg.b;
    event.sender.send('mul-async-reply', result);
});

ipc.on('capture-sync',function(event, arg){
    console.log("capture -> ");
    console.log(arg);

    win.loadURL(arg.url);

    win.webContents.on('did-finish-load', captureFunc);
});

function captureFunc(){
    var t = new Date();
    var fname = "./img/finance-"+t.getTime()+".png";

    win.capturePage(function(img){
        fs.writeFileSync(fname, img.toPng());
        //win.loadURL(HOME_URL);
        app.quit();
    });
}

ipc.on('delayshot-sync', function(event, arg){
    console.log("delayshot -> ");
    console.log(arg);

    win.loadURL(arg.url);

    win.webContents.on('did-finish-load', delayCaptureFunc);
});

function delayCaptureFunc(){
    setTimeout(function(){
        var fname = "./img/cat-"+(new Date()).getTime()+".png";
        win.capturePage(function(img){
            fs.writeFileSync(fname, img.toPng());
            app.quit();
        });
    }, 1000*1);
}
