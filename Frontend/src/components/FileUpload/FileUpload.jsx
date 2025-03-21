import React, { useState, useRef } from "react";
import Confetti from "react-confetti";
import Navbar from "../Homepage/Navbar/Navbar";
import { useWindowSize } from "react-use";
import toast from "react-hot-toast";
import axios from "axios";
import { validateFile } from "secure-file-validator";
import "./FileUpload.css";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sanitizedFileName, setSanitizedFileName] = useState("");

  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [btnText, setbtnText] = useState("Get Metadata");

  const fileInputRef = useRef(null);

  const { width, height } = useWindowSize();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (fileList) => {
    const file = fileList[0]; // Process only one file

    if (!file) return;

    // ✅ Scan the file for malware
    const isValid = await validateFile(file);

    if (!isValid) {
      toast.error(`🚨 Malicious file detected: ${file.name}`);
      return; // Stop processing if the file is malicious
    }

    // ✅ Store the valid file in state
    setFiles([
      {
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + "MB",
        id: Date.now(),
      },
    ]);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((fileObj) => {
      formData.append("file", fileObj.file);
    });

    try {
      setUploading(true);
      toast.loading("Uploading files...", { id: "upload" });

      const response = await axios.post(`/api/files/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.dismiss("upload");
      toast.success("Files uploaded successfully!");
      console.log("Server Response:", response.data);

      if (response.data.sanitizedFileName) {
        setSanitizedFileName(response.data.sanitizedFileName);
        console.log("sanitized file name", sanitizedFileName);
      }

      setFiles([]); // ✅ Clear files after successful upload
    } catch (error) {
      toast.dismiss("upload");
      toast.error(error.response?.data?.message || "Upload failed!");
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchMetadata = async () => {
    if (!sanitizedFileName) {
      toast.error("No sanitized file found.");
      return;
    }

    try {
      setLoadingMetadata(true);
      toast.loading("Fetching metadata...", { id: "fetchMeta" });

      const response = await axios.get(`/api/files/metadata`, {
        params: { fileName: sanitizedFileName },
        withCredentials: true,
      });

      toast.dismiss("fetchMeta");

      if (response.data.malicious) {
        toast.error("🚨 Malicious file detected! Metadata not found.");
        return;
      }

      toast.success("Metadata fetched successfully!");
      console.log("📂 Fetched Metadata Response:", response.data);

      if (response.data.metadata) {
        setMetadata(response.data);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 7000);
      } else {
        toast.error("Metadata format incorrect!");
      }
    } catch (error) {
      toast.dismiss("fetchMeta");
      toast.error(error.response?.data?.message || "Failed to fetch metadata!");
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handleUploadAnother = () => {
    setFiles([]); // ✅ Clear uploaded files
    setSanitizedFileName(""); // ✅ Reset sanitized file name
    setMetadata(null); // ✅ Clear metadata
    setbtnText("Get Metadata"); // ✅ Reset button text

    // ✅ Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
      fileInputRef.current.click(); // Trigger file input
    }
  };

  return (
    <div className="homepage-container">
      <Navbar />
      {showConfetti && <Confetti width={width} height={height} />}

      <section className="upload-section">
        <div className="upload-content">
          <div className="title-container">
            <h1>Meta Data Sanitization</h1>
          </div>

          <div className="upload-container">
            <div className="upload-title">
              <span>Upload Files</span>
            </div>

            <div
              className={`drop-area ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <div className="drop-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
                </svg>
              </div>
              <p className="drop-text">Drop your file here, or browse</p>
              <p className="file-constraints">File must be less than 2MB</p>
              <p className="file-constraints">Maximum Upload 3 Files</p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                style={{ display: "none" }}
                multiple
              />
            </div>

            {files.length > 0 && (
              <div className="files-list">
                {files.map((file) => (
                  <div key={file.id} className="file-item">
                    <div className="file-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{file.size}</span>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => removeFile(file.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}

                <button
                  className="upload-button"
                  onClick={uploadFiles}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Sanitize"}
                </button>
              </div>
            )}

            {sanitizedFileName && (
              <button
                className="fetch-metadata-button"
                onClick={fetchMetadata}
                disabled={loadingMetadata}
              >
                {loadingMetadata ? "Fetching Metadata..." : `${btnText}`}
              </button>
            )}
            {metadata && metadata.metadata && (
              <div className="metadata-container">
                <h2>Metadata Comparison</h2>

                <div className="metadata-section">
                  <h3>📌 Existing Metadata in uploaded file </h3>
                  <ul className="metadata-list">
                    {Object.entries(metadata.metadata.input_metadata).map(
                      ([key, value]) => (
                        <li key={key}>
                          <strong>{key.replace("/", "")}:</strong> {value}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="metadata-section">
                  <h3>✅ Your Metadata is Sanitized </h3>
                  <ul className="metadata-list">
                    {Object.entries(metadata.metadata.output_metadata).map(
                      ([key, value]) => (
                        <li key={key}>
                          <strong>{key.replace("/", "")}:</strong> {value}
                        </li>
                      )
                    )}
                  </ul>
                  <h3>
                    Download the sanitized file from here:{" "}
                    <a href={metadata.metadata.sanitized_url} target="_blank">
                      Download Now
                    </a>
                  </h3>
                </div>

                {/* ✅ Upload Another File Button */}
                <button
                  className="upload-another-button"
                  onClick={handleUploadAnother}
                >
                  Upload Another File
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FileUpload;
