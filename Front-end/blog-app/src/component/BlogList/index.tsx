import { Blog } from "../../interface/blogInterface";
import React, { useState, useEffect } from 'react';
const BlogList: React.FC<{ blogs: Blog[] }> = ({ blogs }) => {
    return (
      <ul>
        {blogs.map((blog, index) => (
          <li key={index}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <p>
              Created By: {blog.createdBy} | Created At: {blog.createdAt}
            </p>
          </li>
        ))}
      </ul>
    );
  };
export default BlogList;