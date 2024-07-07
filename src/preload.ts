// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer, nativeImage } = require('electron');

contextBridge.exposeInMainWorld('Electron', {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
    on: (channel: string, func: (...args: any[]) => void) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    once: (channel: string, func: (...args: any[]) => void) => ipcRenderer.once(channel, (event, ...args) => func(...args)),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
  },
  nativeImage: {
    createFromPath: (filePath: string) => nativeImage.createFromPath(filePath),
  },
  processes: {
    previewVideo: (filePaths: string[], outputVideoPath: string) => {
        ipcRenderer.invoke('preview-video', filePaths, outputVideoPath);
    },
  }
});