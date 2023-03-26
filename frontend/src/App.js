import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CustomerDashboard from "./components/CustomerDashboard";

import { BrowserRouter as Router, Route, Routes , Redirect} from 'react-router-dom';

import "./App.css";

function App() {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/customerdashboard" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


