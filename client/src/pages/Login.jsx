import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
 
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <div><input className="border rounded-xl bg-white p-6 text-center" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div><input className="border rounded-xl bg-white p-6 text-center" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      <button type="submit">Login</button>
    </form>
  );
}
