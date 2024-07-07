import { ipcMain, dialog } from "electron";
import fs from "fs/promises";
import './previewVideo';

/**
 * This file is used to register IPC handles for the application.
 */

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