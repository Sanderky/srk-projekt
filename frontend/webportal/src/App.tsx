import React from 'react';
import ConfirmationPanel from './Modules/ConfirmationPanel/ConfirmationPanel';
import LoginPanel from './Modules/LoginPanel/LoginPanel';
import Registration from './Modules/Registration/Registration';
import QueueDisplay from './Modules/QueueDisplay/QueueDIsplay';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './Modules/LoginPanel/ProtectedRoute';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/LoginPanel/:directTo" element={<LoginPanel/>}/>

        <Route path="/" element={<Registration />}/>
      
        <Route element={<ProtectedRoute redirectPath="/LoginPanel" directTo="/queueDisplay" roleNeeded="doctor"/>}>
          <Route path="/queueDisplay" element={<QueueDisplay />}/>
        </Route>


        <Route element={<ProtectedRoute redirectPath="/LoginPanel" directTo="/confirmation-panel" roleNeeded="doctor"/>}>
          <Route path="/confirmation-panel" element={<ConfirmationPanel />}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
