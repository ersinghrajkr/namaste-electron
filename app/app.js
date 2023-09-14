const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');

let mainWindow;

app.on('ready', () => {
    console.log("App is now ready!");
    mainWindow = new BrowserWindow({ 
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
          },
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`)
})

ipcMain.on('video:submit', (event, videoFilePath)=>{
    console.log(1);
    ffmpeg.ffprobe(videoFilePath, (error, metadata) => {
        if(error) {
            throw error
        }
        console.log('Video Duration is: ', metadata.format.duration)
        event.sender.send("video:metadata", metadata.format.duration) 
    })
})