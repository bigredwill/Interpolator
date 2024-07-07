import { ipcMain, dialog } from "electron";
const path = require("path");
const fs = require("fs").promises;

export default function registerIpcHandles() {
  ipcMain.handle("open-directory-dialog", async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return result.filePaths;
  });

  ipcMain.handle("read-files-in-directory", async (event, directoryPath) => {
    try {
      const files = await fs.readdir(directoryPath);
      return files;
    } catch (error) {
      console.error("Error reading directory:", error);
      throw error; // Propagate the error back to the renderer process
    }
  });

  // ipcMain.handle("")
}
