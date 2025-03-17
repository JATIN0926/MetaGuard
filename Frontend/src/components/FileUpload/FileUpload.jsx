import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Homepage/Navbar/Navbar';
import Footer from '../Homepage/Footer/Footer';
import './FileUpload.css';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      id: Date.now() + Math.random().toString(36).substring(2, 15)
    }));
    
    // Limit to maximum 3 files as shown in the example
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      return updatedFiles.slice(0, 3);
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  const uploadFiles = () => {
    // This function would handle the actual upload process
    console.log('Uploading files:', files);
    // Here you would add API calls to process the files
  };

  return (
    <div className="homepage-container">
      <Navbar />
      
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
              className={`drop-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <div className="drop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                style={{ display: 'none' }} 
                multiple
              />
            </div>
            
            {files.length > 0 && (
              <div className="files-list">
                {files.map(file => (
                  <div key={file.id} className="file-item">
                    <div className="file-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{file.size}</span>
                    </div>
                    <button className="delete-button" onClick={() => removeFile(file.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>

                  </div>
                ))}
                
                <button className="upload-button" onClick={uploadFiles}>Sanitize</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FileUpload;