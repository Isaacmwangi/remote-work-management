// src/App.jsx
import React from "react";
import AppRouter from "./routes/Router";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

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
