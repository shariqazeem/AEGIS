// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Vault from './pages/Vault';
import Calibration from './pages/Calibration';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vault" element={<Vault />} />
                    <Route path="/calibration" element={<Calibration />} />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
