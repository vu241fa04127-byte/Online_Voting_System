import React from 'react';
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                form
            );

            setMessage(res.data.message);
            setForm({ name: "", email: "", password: "" });
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Registration failed"
            );
        }
    }

    return (
        <div className="form-container">
            <h2>Voter Registration</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password (minimum 8 characters)"
                    value={form.password}
                    onChange={handleChange}
                    minLength="8"
                    required
                />

                <button type="submit">Register</button>
            </form>

            <p>{message}</p>
            <Link to="/login">Already have an account? Login</Link>
        </div>
    );
}

export default Register;
