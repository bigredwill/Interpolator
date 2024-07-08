import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import os from "os";

function imagesToVideo(
  filePaths: string[],
  outputVideoPath: string,
  callback: Function
) {
  const tempFilePath = path.join(os.tmpdir(), "image_list.txt");
  const fileContent = filePaths.map((file) => `file '${file}'`).join("\n");
  fs.writeFileSync(tempFilePath, fileContent);

  if (fs.existsSync(outputVideoPath)) {
    fs.unlinkSync(outputVideoPath);
  }

  const ffmpegCommand = `ffmpeg -f concat -safe 0 -r 24 -i ${tempFilePath} -c:v libx264 -pix_fmt yuv420p ${outputVideoPath}`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return callback(error);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    callback(null, outputVideoPath);
  });
}
// Listen to messages from the main process
process.on("message", (msg: { command?: string; filePaths?: string[]; outputVideoPath?: string }) => {
  if (msg.command === "convert") {
    imagesToVideo(
      msg.filePaths || [],
      msg.outputVideoPath || "",
      (error: any, result: string) => {
        process.send({ error, result });
      }
    );
  }
});

export { imagesToVideo };
