import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:5000/api/votes/status", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setStatus(res.data.hasVoted))
        .catch(() => setStatus(false));
    }, []);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <div className="container">
            <h1>Welcome, {user?.name}</h1>
            <h2>Voter Dashboard</h2>

            <div className="card">
                <h3>Voting Status</h3>
                <p>{status ? "You have already voted." : "You have not voted yet."}</p>
            </div>

            {!status && (
                <Link to="/candidates" className="btn">
                    Cast Your Vote
                </Link>
            )}

            <Link to="/results" className="btn">
                View Results
            </Link>
        </div>
    );
}

export default Dashboard;
