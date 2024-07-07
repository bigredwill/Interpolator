import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

/**
 * Todo: Modify so that we can take a different video output.
 */
export function processRifeNcnnVulkan(inputDir: string) {
  if (!inputDir) {
    console.error("Input directory is required.");
    return;
  }

  console.log(`i: ${inputDir}`);

  const outputDir = path.join(inputDir, "out");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  //  Remove non image files
  // Todo: change this to just process image files, ignore all else.
  const dsStorePath = path.join(inputDir, ".DS_Store");
  if (fs.existsSync(dsStorePath)) {
    fs.rmSync(dsStorePath);
  }

  const rifeCommand = `${process.env.HOME}/scripts/rife-ncnn-vulkan-20220728-macos/rife-ncnn-vulkan -m rife-v4 -i ${inputDir} -o ${outputDir}`;
  execSync(rifeCommand);

  const videoName = path.join(inputDir, `${path.basename(inputDir)}.mp4`);
  console.log(videoName);

  const ffmpegCommand = `ffmpeg -r 16 -f image2 -s 1920x1080 -i ${outputDir}/%08d.png -vcodec libx264 -crf 25 -metadata:s:v rotate=90 -pix_fmt yuv420p ${videoName}`;
  execSync(ffmpegCommand);

  const pngFiles = fs.readdirSync(outputDir).filter(file => file.endsWith(".png"));
  pngFiles.forEach(file => fs.rmSync(path.join(outputDir, file)));

  fs.rmdirSync(outputDir);
}
