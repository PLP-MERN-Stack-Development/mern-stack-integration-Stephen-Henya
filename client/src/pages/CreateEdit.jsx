import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { postService, categoryService } from '../services/api';
import { useAuth } from '../context/useAuth';

export default function CreateEdit({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [featuredImage, setFeaturedImage] = useState('');

  useEffect(() => {
    categoryService.getAllCategories().then(data => setCategories(data.categories || data));
    if (edit && id) {
      postService.getPost(id).then(data => {
        const p = data.post || data;
        setTitle(p.title);
        setBody(p.body);
        setSelectedCats((p.categories || []).map(c => c._id));
        setFeaturedImage(p.featuredImage || '');
      });
    }
  }, [edit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = featuredImage;
      if (imageFile) {
        const fd = new FormData();
        // server expects the field name 'image' (upload.single('image'))
        fd.append('image', imageFile);
        const up = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = up.data?.url || up.url;
      }

      const payload = { title, body, categories: selectedCats, featuredImage: imageUrl };
      if (edit) await postService.updatePost(id, payload);
      else await postService.createPost(payload);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to save post');
    }
  };

  if (!user) return <div>Please login to create posts.</div>;

  return (
    <div className="flex flex-col gap-4 items-center" >
      <h2 className="flex items-center justify-between text-lg font-bold">{edit ? 'Edit Post' : 'Create Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-lg font-semibold">Title</label><br />
          <input className="border-2 border-black p-0.5 bg-white-700 hover:bg-gray-200" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="text-lg font-semibold">Body</label><br />
          <textarea className="border-2 border-black p-0.5 bg-white-700 hover:bg-gray-200" value={body} onChange={e => setBody(e.target.value)} required rows={5} />
        </div>
        <div>
          <label className="text-lg font-semibold">Categories</label><br />
          <select className="border-2 border-black p-0.5 bg-white-700 hover:bg-gray-200" multiple value={selectedCats} onChange={e => setSelectedCats([...e.target.selectedOptions].map(o => o.value))}>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-lg font-semibold">Featured Image</label><br />
          <input className="border-2 border-black p-0.5 bg-white-700 hover:bg-gray-200" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          {featuredImage && <div><img src={featuredImage} alt="" style={{ maxWidth: 200 }} /></div>}
        </div>
        <div className="flex gap-2 m-2">
          <button className="border-2 border-black p-0.5 bg-green-600 text-lg font-semibold hover:bg-green-800 rounded-md" type="submit">{edit ? 'Update' : 'Create'}</button>
          <button className="border-2 border-black p-0.5 bg-red-600 text-lg font-semibold hover:bg-red-800 rounded-md" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
