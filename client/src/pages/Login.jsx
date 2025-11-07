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
      <h2 className="text-xl text-center font-bold">Login to access the Content</h2>
      <div className="grid w-full items-center columns-2 m-2">
        <input className="border-2 border-black rounded-xl bg-white p-2.5 text-center m-1" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border-2 border-black rounded-xl bg-white p-2.5 text-center m-1" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      <button className="border-2 border-black rounded-xl p-0.5 text-lg flex justify-center bg-amber-400 hover:bg-amber-700" type="submit">Login</button>
    </form>
  );
}
