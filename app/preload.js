const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  submitVideo: (videoFilePath) => {
    ipcRenderer.send("video:submit", videoFilePath);
  },


  receiveVideoMetadata: (onMetadataReceived) => {
    ipcRenderer.on("video:metadata", (event, videoDuration) => {
      onMetadataReceived(videoDuration);
    });
  },

});


/**
 * Adding the nodeIntegration: true 
 * configuration is not a good security practice. 
 * This discussion can be found here:https://github.com/electron/electron/issues/9920#issuecomment-575839738
 * To properly update your project you will need to add a preload.js module as a bridge between the main process and the renderer process. 
 * The contextBridge will then expose only the functionality needed.
 */