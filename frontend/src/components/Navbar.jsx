
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <h2>Online Voting System</h2>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/candidates">Candidates</Link>
                <Link to="/results">Results</Link>

                {token && <Link to="/dashboard">Dashboard</Link>}

                {user?.role === 'admin' && (
                    <Link to="/admin">Admin</Link>
                )}

                {!token ? (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                ) : (
                    <button onClick={logout}>Logout</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
