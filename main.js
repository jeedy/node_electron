var TARGET_URL = "https://ko.wikipedia.org/";

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var win;
app.on('ready', function(){
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadURL(TARGET_URL);
});