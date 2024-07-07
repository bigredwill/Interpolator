#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const argv = require("minimist")(process.argv.slice(2));
const exif = require("exif-reader");
const { execSync } = require('child_process');

async function sortFilesToDirectories(startPath) {
  let sortedFiles;
  console.log(startPath)
  await fs.readdir(startPath, async (err, entries) => {
    console.error(err)
    let lastImageDate = null;
    sortedFiles = await entries.reduce(async (fileFoldersPromise, fileName) => {
      const fileFolders = await fileFoldersPromise;
      const filePath = path.join(startPath, fileName);
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        return;
      }
      let metadata;
      try {
        metadata = await sharp(filePath).metadata();
      } catch (e) {
        // likely not an image, skip it
        console.error(`skipping ${filePath}`);
        return fileFolders;
      }
      const dateTaken = exif(metadata.exif).exif.DateTimeOriginal;
      const diff = dateTaken - lastImageDate;
      if (!lastImageDate || diff > 18001) {
        console.log('pushing to new folder', diff);
        fileFolders.push([filePath]);
      } else {
        console.log('pushing', diff)
        fileFolders[fileFolders.length - 1].push(filePath);
      }
      lastImageDate = dateTaken;
      return fileFolders;
    }, []);

    // return;
    const outDir = path.join(startPath, `out`);
    fs.mkdirSync(outDir);

    const outPaths = [];
    sortedFiles.forEach((fileArray) => {
      if (fileArray.length <= 1) {
        return;
      }
      const startFile = fileArray[0].split("/").splice(-1);
      const endFile = fileArray[fileArray.length - 1].split("/").splice(-1);
      const outPath = path.join(startPath, `out/${startFile}-${endFile}`);
      outPaths.push(outPath);
      fs.mkdirSync(outPath);
      fileArray.forEach((filePath) => {
        const fileName = filePath.split("/").splice(-1)[0];
        fs.rename(filePath, path.join(outPath, fileName), (err) => {
          if (err) {
            console.log("could not move", filePath, err);
          }
        });
      });
    });

    // sorted, look through folders, then run vulkan
    console.log(outDir);
  });
}

sortFilesToDirectories(argv.i);

