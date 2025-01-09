import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './SenderReceiver.css';

const Sender = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [encryptedBlockId, setEncryptedBlockId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hardcoded coordinates
  const coordinates = "40.7128, -74.0060";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSenderSubmit = async () => {
    if (!file || !description || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("coordinates", coordinates);

      const response = await axios.post("http://localhost:3001/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const blockId = response.data.blockNum;

      // Encrypt the Block ID
      const encryptedId = CryptoJS.AES.encrypt(blockId.toString(), password).toString();
      setEncryptedBlockId(encryptedId);

      setFile(null);
      setDescription("");
      setPassword("");
    } catch (err) {
      console.error("Error uploading file:", err.message);
      setError("Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sr-card">
      <h3 className="sr-title">Sender</h3>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>File:</label>
        <input type="file" onChange={handleFileChange} className="input-field" />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          placeholder="Enter a description"
        />
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="Enter a password"
        />
      </div>

      <button 
        onClick={handleSenderSubmit} 
        disabled={loading} 
        className="modern-button"
      >
        {loading ? "Uploading..." : "Send File"}
      </button>

      {encryptedBlockId && (
        <div className="file-metadata">
          <h4>Encrypted Block ID:</h4>
          <p>{encryptedBlockId}</p>
        </div>
      )}
    </div>
  );
};

export default Sender;
