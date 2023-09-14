const { app, BrowserWindow, ipcMain } = require('electron')
const ffmpeg = require('fluent-ffmpeg');

let mainWindow;

app.on('ready', () => {
    console.log("App is now ready!");
    mainWindow = new BrowserWindow({ 
        webPreferences: { nodeIntegration: true, contextIsolation: false },
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`)
})

ipcMain.on('videoSubmitted', (event, videoFilePath)=>{
    console.log(1);
    ffmpeg.ffprobe(videoFilePath, (error, metadata) => {
        if(error) {
            throw error
        }
        console.log('Video Duration is: ', metadata.format.duration)
        mainWindow.webContents.send("submittedVideoDuration", metadata.format.duration) 
    })
})