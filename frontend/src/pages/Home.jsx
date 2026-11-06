
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container home">
            <h1>Welcome to Online Voting System</h1>

            <p>
                A simple and secure platform for online voting.
                Register, login, and cast your vote easily.
            </p>

            <div className="home-buttons">
                <Link to="/register" className="btn">
                    Register Now
                </Link>

                <Link to="/login" className="btn">
                    Login
                </Link>

                <Link to="/candidates" className="btn">
                    View Candidates
                </Link>
            </div>
        </div>
    );
}

export default Home;
