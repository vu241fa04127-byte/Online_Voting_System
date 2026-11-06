
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Results from './pages/Results';
import Admin from './pages/Admin';

import './style.css';

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Authentication Pages */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Voter Pages */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/candidates"
                    element={
                        <ProtectedRoute>
                            <Candidates />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/results"
                    element={<Results />}
                />

                {/* Admin Page */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Admin />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
