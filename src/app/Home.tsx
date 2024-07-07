import React, { useState } from "react";
import FilePicker from "./Components/FilePicker";

/**
 * State management
 * Use redux? preact signals?
 */

const Home: React.FC = () => {
  const [directoryPath, setDirectoryPath] = useState<string>("");
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

  const readFilesInDirectory = async (directory: string) => {
    try {
      const files = await window.Electron.ipcRenderer.invoke(
        "read-files-in-directory",
        directory
      );
      setFiles(files);
      console.log(files);
      console.log(`${directory}/${files[0]}`);
      console.log();
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  return (
    <div>
      <h1>Interpolator</h1>
      <button onClick={handleDirectorySelection}>Select File</button>
      <p>{directoryPath}</p>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {files.map((file, index) => (
          <li key={index}>
            {file}
            <img
              key={index}
              src={`atom://${directoryPath}/${file}`}
              alt={`Image ${index}`}
              style={{ width: "200px", height: "auto", margin: "10px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
