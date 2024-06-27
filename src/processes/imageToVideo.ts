import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import minimist from "minimist";
import exif from "exif-reader";
import { execSync } from 'child_process';

const argv = minimist(process.argv.slice(2));


/**
 * Given a folder of images, will pass to the rife-ncnn-vulkan program.
 * TODO: Get better output from this for processing progress.
 */
export async function folderToVideo(filePath: string) {
  const stat = fs.statSync(filePath);
  if (!stat.isDirectory()) {
    console.log('not a directory');
    return;
  }
  if (fs.readdirSync(filePath).length < 2) {
    console.log('skipping', filePath);
    return;
  }
  try {
    console.log(`running rife-ncnn-vulkan -i ${filePath}`);
    console.log(execSync(`rife-ncnn-vulkan -i ${filePath}`).toString());
  } catch (e) {
    console.error(e);
  }
}

export async function processFolders(foldersDir: string): Promise<void> {
  const entries = fs.readdirSync(foldersDir);
  entries.forEach((fileName) => {
    const filePath = path.join(foldersDir, fileName);
    folderToVideo(filePath);
  });
}