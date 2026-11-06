import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
    const [candidates, setCandidates] = useState([]);
    const [form, setForm] = useState({
        name: "",
        party: "",
        symbol: "🗳️",
        description: ""
    });
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    async function loadCandidates() {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/candidates"
            );
            setCandidates(res.data);
        } catch {
            setMessage("Unable to load candidates");
        }
    }

    useEffect(() => {
        loadCandidates();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editId) {
                await axios.put(
                    `http://localhost:5000/api/candidates/${editId}`,
                    form,
                    config
                );
                setMessage("Candidate updated successfully");
            } else {
                await axios.post(
                    "http://localhost:5000/api/candidates",
                    form,
                    config
                );
                setMessage("Candidate added successfully");
            }

            setForm({
                name: "",
                party: "",
                symbol: "🗳️",
                description: ""
            });

            setEditId(null);
            loadCandidates();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Operation failed"
            );
        }
    }

    function editCandidate(candidate) {
        setForm({
            name: candidate.name,
            party: candidate.party,
            symbol: candidate.symbol || "🗳️",
            description: candidate.description || ""
        });

        setEditId(candidate._id);
    }

    async function deleteCandidate(id) {
        if (!window.confirm("Delete this candidate?")) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/candidates/${id}`,
                config
            );

            setMessage("Candidate deleted successfully");
            loadCandidates();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Delete failed"
            );
        }
    }

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            <h2>Manage Candidates</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Candidate Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="party"
                    placeholder="Party Name"
                    value={form.party}
                    onChange={handleChange}
                    required
                />

                <input
                    name="symbol"
                    placeholder="Election Symbol"
                    value={form.symbol}
                    onChange={handleChange}
                />

                <input
                    name="description"
                    placeholder="Candidate Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editId ? "Update Candidate" : "Add Candidate"}
                </button>

                {editId && (
                    <button type="button" onClick={() => {
                        setEditId(null);
                        setForm({
                            name: "",
                            party: "",
                            symbol: "🗳️",
                            description: ""
                        });
                    }}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <p>{message}</p>

            {candidates.map(candidate => (
                <div className="card" key={candidate._id}>
                    <h3>{candidate.symbol} {candidate.name}</h3>
                    <p>{candidate.party}</p>

                    <button onClick={() => editCandidate(candidate)}>
                        Edit
                    </button>

                    <button onClick={() => deleteCandidate(candidate._id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Admin;
