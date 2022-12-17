import React from 'react';
import ConfirmationPanel from './Modules/ConfirmationPanel/ConfirmationPanel';
import Dashboard from './Modules/Dashboard/Dashboard';
import Registration from './Modules/Registration/Registration';
import QueueDisplay from './Modules/QueueDisplay/QueueDIsplay';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/confirmation-panel" element={<ConfirmationPanel />}/>
        <Route path="/" element={<Registration />}/>
        <Route path="/queueDisplay" element={<QueueDisplay />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
