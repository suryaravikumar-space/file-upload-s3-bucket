// App.js
import React from 'react';
import './App.css';
import FileUpload from './FileUpload'
import DisplayImage from './DisplayImage'


function App() {
  return (
    <div className="App">
     
      <h1>Upload Files</h1>
      <FileUpload />
      <DisplayImage />
    </div>
  );
}

export default App;
