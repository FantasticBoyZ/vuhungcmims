import { removePost } from '@/slices/PostSlice';
import testAPI from '@/utils/testApi';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const posts = useSelector((state) => state.posts);

  const handleEditPost = (post) => {
    console.log('Edit ', post);
    const editPostUrl = `/post/${post.id}`
    navigate(editPostUrl)
  };

  const handleRemovePost = (post) => {
    console.log('Remove ', post);
    const removePostId = post.id;
    const action = removePost(removePostId);
    dispatch(action);

  };

  // useEffect(() => {
  //   testAPI.getAllPost().then(
  //     (res) => {
  //       console.log(res.data);
  //       if (!!posts) {
  //         setContent([...res.data, ...posts]);
  //       } else {
  //         setContent(res.data);
  //       }
  //     },
  //     (error) => {
  //       const _content =
  //         (error.response && error.response.data) || error.message || error.toString();
  //       setContent(_content);
  //     },
  //   );
  // }, []);
  return (
    <Box>
      <Typography>HomePage</Typography>
      <Button
        variant="contained"
        component={Link}
        to={'/post/add'}
      >
        Add New Post
      </Button>
      {posts &&
        posts.map((post) => (
          <Box key={post.id}>
            <Typography variant="span">
              {post.id}.{post.title}
            </Typography>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="secondary"
              onClick={() => handleEditPost(post)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemovePost(post)}
            >
              Delete
            </Button>
          </Box>
        ))}
    </Box>
  );
};

export default HomePage;
