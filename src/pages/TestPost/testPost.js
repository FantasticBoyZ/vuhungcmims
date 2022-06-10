import { Box } from '@mui/system';
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '@/components/FormsUI/Textfield';
import Button from '@/components/FormsUI/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePost } from '@/slices/PostSlice';
import { useNavigate, useParams } from 'react-router-dom';

const TestPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get path param
  const { postId } = useParams();

  const editedPost = useSelector((state) => state.posts.find((x) => x.id === +postId));
  const isAddMode = !postId;
  console.log(postId);

  const INITIAL_FORM_STATE = isAddMode
    ? {
        id: '',
        title: '',
      }
    : {
        id: editedPost.id,
        title: editedPost.title,
      };

  const FORM_VALIDATION = Yup.object().shape({
    id: Yup.number().nullable(),
    title: Yup.string(),
  });

  const handleSubmit = (values) => {
    if (isAddMode) {
      const action = addPost(values);
      dispatch(action);
      console.log({ action });
    } else {
      const action = updatePost(values);
      dispatch(action);
    }

    navigate('/');
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
      >
        <Form>
          <Textfield
            name="id"
            label="id"
            margin="normal"
            fullWidth
            id="postId"
            autoComplete="id"
            autoFocus
            disabled={!isAddMode}
            // value={username}
            // onChange={onChangeUsername}
          />

          <Textfield
            name="title"
            label="Tiểu đề"
            margin="normal"
            fullWidth
            id="title"
            autoComplete="string"
            // value={password}
            // onChange={onChangePassword}
          />
          <Button
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
        </Form>
      </Formik>
    </Box>
  );
};

export default TestPost;
