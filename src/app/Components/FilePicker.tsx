import React, { useState } from "react";

interface FilePickerProps {
  onFileSelected: (filePath: string[]) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ onFileSelected }) => {
  const handleFileSelection = async () => {
    const selectedFiles = await window.Electron.ipcRenderer.invoke(
      "open-directory-dialog"
    );
    onFileSelected(selectedFiles);
  };

  return (
    <div>
      <button onClick={handleFileSelection}>Select File</button>
    </div>
  );
};

export default FilePicker;
