import * as fs from "fs";
import * as path from "path";
import os from "os";
import minimist from "minimist";
import { execSync } from "child_process";
import { ipcMain } from "electron";

export type PreviewVideoArgs = { filePaths: string[]; outputVideoPath: string };

ipcMain.handle("preview-video", async (event, args: PreviewVideoArgs) => {
  try {
    const writtenVideoPath = await imagesToVideo(args);
    return writtenVideoPath;
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error; // Propagate the error back to the renderer process
  }
});

export async function imagesToVideo({
  filePaths,
  outputVideoPath,
}: PreviewVideoArgs) {
  if (filePaths.length === 0) {
    console.error("No file paths provided.");
    return;
  }

  const tempFilePath = path.join(os.tmpdir(), "image_list.txt");
  const fileContent = filePaths.map((file) => `file '${file}'`).join("\n");
  fs.writeFileSync(tempFilePath, fileContent);

  if (fs.existsSync(outputVideoPath)) {
    fs.unlinkSync(outputVideoPath);
  }

  const ffmpegCommand = `ffmpeg -f concat -safe 0 -r 24 -i ${tempFilePath} -c:v libx264 -pix_fmt yuv420p ${outputVideoPath}`;

  try {
    await execSync(ffmpegCommand);
    console.log(`Video created at ${outputVideoPath}`);
    return outputVideoPath;
  } catch (error) {
    // todo: handle error
    console.error("Error creating video:", error);
    throw error;
  }
}
