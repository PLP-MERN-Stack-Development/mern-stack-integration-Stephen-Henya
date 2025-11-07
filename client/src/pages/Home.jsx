import React, { useState, useEffect } from 'react';
import { postService } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    postService.getAllPosts(1, 20)
      .then(data => setPosts(data.posts || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-center">Latest Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map(p => (
          <li key={p._id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <Link to={`/posts/${p._id}`}><h3>{p.title}</h3></Link>
                <p style={{ margin: 0 }}>{p.body?.slice(0, 150)}{p.body?.length > 150 && '...'}</p>
                <small>By {p.author?.name} • {new Date(p.createdAt).toLocaleString()}</small>
              </div>
              <div style={{ marginLeft: 12 }}>
                {/* Show Edit/Delete only to post owner */}
                {user && String(user._id || user.id) === String(p.author?._id || p.author?.id) && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/edit/${p._id}`}><button>Edit</button></Link>
                    <button onClick={async () => {
                      if (!confirm('Delete this post?')) return;
                      try {
                        await postService.deletePost(p._id);
                        // remove from state
                        setPosts(prev => prev.filter(x => x._id !== p._id));
                      } catch (err) {
                        console.error(err);
                        alert('Failed to delete post');
                      }
                    }}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
