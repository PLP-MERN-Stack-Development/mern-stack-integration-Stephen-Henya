import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';


export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <div><input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required /></div>
      <div><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div><input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      <button type="submit">Register</button>
    </form>
  );
}
