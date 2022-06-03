import testAPI from '@/utils/testApi';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [content, setContent] = useState([]);
  useEffect(() => {
    testAPI.getAllPost().then(
      (res) => {
        console.log(res.data);
        setContent(res.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) || error.message || error.toString();
        setContent(_content);
      },
    );
  }, []);
  return (
    <Box>
      HomePage
        {content &&
          content.map((post) => (
            <h3 key={post.id}>
              {post.id}.{post.title}
            </h3>
          ))}
    </Box>
  );
};

export default HomePage;
