import React, { useState, useEffect } from 'react';
import BlogForm from './component/BlogForm/index';
import BlogList from './component/BlogList/index';
import { Blog } from './interface/blogInterface';

const App: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }, [blogs]);

  const addBlog = (blog: Blog) => {
    setBlogs([blog, ...blogs]);
  };

  const sortBlogs = (order: 'asc' | 'desc') => {
    const sortedBlogs = [...blogs].sort((a, b) => {
      if (order === 'asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    setBlogs(sortedBlogs);
  };

  return (
    <div>
      <h1>Blog App</h1>
      <BlogForm addBlog={addBlog} />
      <div>
        <button onClick={() => sortBlogs('asc')}>Sort Oldest</button>
        <button onClick={() => sortBlogs('desc')}>Sort Newest</button>
      </div>
      <BlogList blogs={blogs} />
    </div>
  );
};

export default App;
