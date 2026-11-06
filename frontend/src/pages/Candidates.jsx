import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState("");
    const [message, setMessage] = useState("");
    const [hasVoted, setHasVoted] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get("http://localhost:5000/api/candidates")
            .then(res => setCandidates(res.data))
            .catch(() => setMessage("Could not load candidates"));

        if (token) {
            axios.get("http://localhost:5000/api/votes/status", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setHasVoted(res.data.hasVoted))
            .catch(() => {});
        }
    }, [token]);

    async function submitVote() {
        if (!selected) {
            setMessage("Please select a candidate");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/votes",
                { candidateId: selected },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(res.data.message);
            setHasVoted(true);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Voting failed"
            );
        }
    }

    return (
        <div className="container">
            <h1>Election Candidates</h1>

            <div className="candidate-grid">
                {candidates.map(candidate => (
                    <div className="card" key={candidate._id}>
                        <h2>{candidate.symbol}</h2>
                        <h3>{candidate.name}</h3>
                        <p>{candidate.party}</p>
                        <p>{candidate.description}</p>

                        {!hasVoted && token && (
                            <label>
                                <input
                                    type="radio"
                                    name="candidate"
                                    checked={selected === candidate._id}
                                    onChange={() => setSelected(candidate._id)}
                                />
                                Select Candidate
                            </label>
                        )}
                    </div>
                ))}
            </div>

            {token && !hasVoted && (
                <button onClick={submitVote}>Submit Vote</button>
            )}

            {hasVoted && <h3>You have already voted!</h3>}

            <p>{message}</p>
        </div>
    );
}

export default Candidates;
