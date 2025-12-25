"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  // This runs when the page loads
  useEffect(() => {
    // 1. Call the Python API
    axios.get('http://127.0.0.1:8000/')
      .then((response) => {
        // 2. If successful, show the message from Python
        setMessage(response.data.message);
      })
      .catch((error) => {
        // 3. If failed, show error
        console.error(error);
        setMessage("Error connecting to backend");
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Quiz App Prototype</h1>
      <p className="text-xl mt-4">Backend Status: <span className="text-green-500 font-bold">{message}</span></p>
    </div>
  );
}