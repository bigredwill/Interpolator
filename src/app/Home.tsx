import React, { useState } from "react";
import FilePicker from "./Components/FilePicker";

/**
 * State management
 * Use redux? preact signals?
 */

const Home: React.FC = () => {
  const [directoryPath, setDirectoryPath] = useState<string>("");
  const [outputVideoPath, setOutputVideoPath] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);

  const handleDirectorySelection = async () => {
    try {
      const [directory] = await window.Electron.ipcRenderer.invoke(
        "open-directory-dialog"
      );
      setDirectoryPath(directory);
      readFilesInDirectory(directory);
    } catch (error) {
      console.error("Error selecting directory:", error);
    }
  };

  const previewVideo = async () => {
    try {
      console.log(`${directoryPath}/${files[0]}-vid.mp4`);
      const outputVideo = await window.Electron.ipcRenderer.invoke(
        "preview-video",
        {
          filePaths: files.map((filePath) => `${directoryPath}/${filePath}`),
          outputVideoPath: `${directoryPath}/${files[0]}-preview.mp4`,
        }
      );
      console.log("setting output", outputVideo);
      setOutputVideoPath(outputVideo);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const readFilesInDirectory = async (directory: string) => {
    try {
      const files = await window.Electron.ipcRenderer.invoke(
        "read-files-in-directory",
        directory
      );
      const imageFiles = files.filter(
        (file: string) =>
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".png") ||
          file.toLowerCase().endsWith(".jpeg")
      );
      setFiles(imageFiles);
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  return (
    <div>
      <h1>Interpolator</h1>
      <button onClick={handleDirectorySelection}>Select File</button>
      <button onClick={previewVideo}>Preview Video</button>
      <video
        style={{
          maxWidth: "100%",
          width: 400,
        }}
        src={`atom://${outputVideoPath}`}
        controls
      />
      <p>
        <b>directory:</b>
        {directoryPath}
      </p>
      <p>images: {files.length}</p>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        {files.map((file, index) => (
          <li key={index} style={{ display: "flex", flexDirection: "row" }}>
            <p>{file}</p>
            <img
              key={index}
              src={`atom://${directoryPath}/${file}`}
              alt={`Image ${index}`}
              style={{ width: "auto", height: "20px", margin: "10px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
