import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Route, Routes , Redirect} from 'react-router-dom';

import "./App.css";

function App() {
  const access_token = localStorage.getItem('access_token');

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;


// <Route path="/login" element={<Login />} />
// {access_token ? (
//   <Route path="/dashboard" element={<Dashboard />} />
// ) : (
//   <Route  path="/login" render={() => <Redirect to="/login" replace/>} />
// )}
// </Routes>