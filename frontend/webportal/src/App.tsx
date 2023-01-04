import React from 'react';
import ConfirmationPanel from './Modules/ConfirmationPanel/ConfirmationPanel';
import LoginPanel from './Modules/LoginPanel/LoginPanel';
import Registration from './Modules/Registration/Registration';
import QueDisplay from './Modules/QueDisplay/QueDisplay';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './Modules/LoginPanel/ProtectedRoute';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-panel/:directTo" element={<LoginPanel />} />

        <Route path="/" element={<Registration />} />

        <Route element={<ProtectedRoute redirectPath="/login-panel" directTo="/que-display" roleNeeded="doctor" />}>
          <Route path="/que-display" element={<QueDisplay />} />
        </Route>

        <Route element={<ProtectedRoute redirectPath="/login-panel" directTo="/confirmation-panel" roleNeeded="doctor" />}>
          <Route path="/confirmation-panel" element={<ConfirmationPanel />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
