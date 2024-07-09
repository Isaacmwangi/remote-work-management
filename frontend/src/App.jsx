// src/App.jsx
import React from 'react';
import AppRouter from './routes/Router';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext'; // Correct path to AuthProvider

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
