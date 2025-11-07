import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/useAuth';


export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    postService.getPost(id)
      .then(data => setPost(data.post || data))
      .catch(console.error);
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await postService.deletePost(id);
      navigate('/');
    } catch (err) { console.error(err); alert('Failed to delete'); }
  };

  if (!post) return <div>Loading...</div>;

  const isOwner = user && String(user._id || user.id) === String(post?.author?._id || post?.author?.id);

  return (
    <div>
      <h2>{post.title}</h2>
      {post.featuredImage && <img src={post.featuredImage} alt="" style={{ maxWidth: '100%', height: 'auto' }} />}
      <p>{post.body}</p>
      <p><small>By {post.author?.name}</small></p>
      {isOwner && (
        <div>
          <Link to={`/edit/${post._id}`}><button>Edit</button></Link>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
