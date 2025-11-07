import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import PostView from './pages/PostView'
import CreateEdit from './pages/CreateEdit'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/useAuth'

export default function App(){
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Week 4 • Blog App</h1>
            <p className="text-slate-600 text-sm">
              Express + MongoDB backend • React + Tailwind + Radix front-end • axios
            </p>
          </div>

          <nav className="flex items-center gap-4">
            <Link to="/">Home</Link>
            {user ? (
              <>
                <Link to="/create">Create Post</Link>
                <button onClick={logout} className="text-red-500">
                  Logout
                </button>
                <span className="text-slate-600">Hi, {user.name}</span>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="py-6">
        <div className="mx-auto max-w-5xl">
          <Routes>
            <Route path="/" element={
              !user ? (
                <div className="border rounded-xl bg-white p-6 text-center">
                  <h2 className="text-lg font-semibold mb-2">Welcome to our Blog App</h2>
                  <p className="text-slate-600">Please sign in to manage your posts</p>
                </div>
              ) : (
                <Home />
              )
            } />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/create" element={<CreateEdit />} />
            <Route path="/edit/:id" element={<CreateEdit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
