import * as path from "path";
import { fork } from "child_process";
import { ipcMain } from "electron";

export type PreviewVideoArgs = { filePaths: string[]; outputVideoPath: string };

ipcMain.handle("preview-video", async (event, args: PreviewVideoArgs) => {
  return new Promise((resolve, reject) => {
    const ffmpegWorker = fork(
      path.join(__dirname, "processes/ffmpegWorker.js")
    );
    ffmpegWorker.on("message", (msg: { error?: string; result?: string }) => {
      console.log('msg', msg);
      if (msg.error) {
        console.error(msg.error);
        reject(msg.error);
      } else {
        console.log(msg.result);
        resolve(msg.result);
      }
      ffmpegWorker.kill();
    });

    ffmpegWorker.send({
      command: "convert",
      filePaths: args.filePaths,
      outputVideoPath: args.outputVideoPath,
    });
  });
});
