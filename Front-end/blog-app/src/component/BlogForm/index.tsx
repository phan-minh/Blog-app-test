import { Blog } from "../../interface/blogInterface";
import React, { useState, useEffect } from 'react';
const BlogForm: React.FC<{ addBlog: (blog: Blog) => void }> = ({ addBlog }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [createdBy, setCreatedBy] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      const createdAt = new Date().toISOString();
      const newBlog: Blog = { title, content, createdBy, createdAt };
      addBlog(newBlog);
  
      setTitle('');
      setContent('');
      setCreatedBy('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="createdBy">Created By:</label>
          <input
            type="text"
            id="createdBy"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />
        </div>
        <button type="submit">Add Blog</button>
      </form>
    );
  };
export default BlogForm;