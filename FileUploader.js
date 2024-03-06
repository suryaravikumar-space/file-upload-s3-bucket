// FileUploader.js
import React, { useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

const FileUploader = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });
      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Files uploaded successfully!');
      // Fetch Object URLs from AWS
      fetchObjectURLs();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  const fetchObjectURLs = async () => {
    try {
      // Initialize AWS SDK with your credentials
      AWS.config.update({
        // accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        accessKeyId: 'AKIA3FLD4ZGXODYNCC7W',
        // secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        secretAccessKey: 'ONQP0EXljXq7oeizkTM/6pDPyMcR6gB8gX/uuLOK',
        region: 'ap-south-1', // Replace 'your-region' with your AWS region
      });
  
      const s3 = new AWS.S3();
  
      const objectURLs = [];
  
      for (const file of uploadedFiles) {
        const params = {
          Bucket: 'ingress-s3-file-upload',
          Key: `uploads/${file.name}`, // Assuming uploads are stored in a folder named 'uploads'
          Expires: 3600, // URL expiration time in seconds
        };
  
        // Generate a presigned URL for the object
        const url = await s3.getSignedUrlPromise('getObject', params);
        objectURLs.push(url);
      }
  
      console.log('Object URLs:', objectURLs);
      return objectURLs;
    } catch (error) {
      console.error('Error fetching Object URLs:', error);
      throw error;
    }
  
  };

  return (
    <div className="file-uploader">
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div className="grid-container">
        {files.slice(0, 8).map((file, index) => (
          <div key={index} className="grid-item">
            <img src={URL.createObjectURL(file)} alt={`File ${index}`} />
          </div>
        ))}
        {files.length > 8 && (
          <div className="grid-item upload-button">
            <button onClick={handleUpload}>+</button>
          </div>
        )}
      </div>
    </div>
  );
};



export default FileUploader;
