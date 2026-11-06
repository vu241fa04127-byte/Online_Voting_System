import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

function Results() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/votes/results")
            .then(res => setResults(res.data))
            .catch(() => {});
    }, []);

    return (
        <div className="container">
            <h1>Election Results</h1>

            {results.length === 0 ? (
                <p>No votes have been recorded yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Candidate</th>
                            <th>Party</th>
                            <th>Total Votes</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map(item => (
                            <tr key={item.candidateId}>
                                <td>{item.symbol}</td>
                                <td>{item.name}</td>
                                <td>{item.party}</td>
                                <td>{item.totalVotes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Results;
