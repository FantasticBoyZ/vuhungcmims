import { removePost } from '@/slices/PostSlice';
import testAPI from '@/utils/testApi';
import { AccountCircle, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import InventoryChart from '@/pages/Home/InventoryChart';

const useStyles = makeStyles((theme) => ({
  cardInfo: {
    minHeight: '180px',
  },
  contentContainer: {
    minHeight: '180px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  widget: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    color: '#9FA2B4',
    textAlign: 'center',
    fontWeight: '500',
    margin: '0',
  },
  number: {
    fontSize: '40px',
    color: '#252733',
    fontWeight: '500',
    margin: '0',
  },
  searchField: {
    minHeight: '53px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50px',
    outline: 'none',
  },
  noBorder: {
    border: 'none',
  },
  chart: {
    height: '50vh',
    width: '100%'
  }
}));
const HomePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const posts = useSelector((state) => state.posts);

  const handleEditPost = (post) => {
    console.log('Edit ', post);
    const editPostUrl = `/post/${post.id}`;
    navigate(editPostUrl);
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
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={3}
            item
          >
            <Card className={classes.cardInfo}>
              <CardContent className={classes.contentContainer}>
                <Box className={classes.widget}>
                  <p className={classes.title}>Số nhân viên hiện tại</p>
                </Box>
                <Box className={classes.widget}>
                  <p className={classes.number}>6</p>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={3}
            item
          >
            <Card className={classes.cardInfo}>
              <CardContent className={classes.contentContainer}>
                <Box className={classes.widget}>
                  <p className={classes.title}>Số đơn nhập đang chờ xét duyệt</p>
                </Box>
                <Box className={classes.widget}>
                  <p className={classes.number}>6</p>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={3}
            item
          >
            <Card className={classes.cardInfo}>
              <CardContent className={classes.contentContainer}>
                <Box className={classes.widget}>
                  <p className={classes.title}>Số đơn xuất đang chờ xét duyệt</p>
                </Box>
                <Box className={classes.widget}>
                  <p className={classes.number}>6</p>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={3}
            item
          >
            <Card className={classes.cardInfo}>
              <CardContent className={classes.contentContainer}>
                <Box className={classes.widget}>
                  <p className={classes.title}>Số đơn hàng lưu kho</p>
                </Box>
                <Box className={classes.widget}>
                  <p className={classes.number}>6</p>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={12}
            item
          >
            <TextField
              id="outlined-basic"
              className={classes.searchField}
              name="functionSearch"
              placeholder="Tìm kiếm chức năng..."
              fullWidth
              label={null}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              // onKeyDown={handleSearch}
              // onChange={handleSearchChange}
            />
          </Grid>
          <Grid
            xs={12}
            item
          >
            <Card>
              <CardHeader title="Lượng tồn kho theo tháng" />
              <CardContent>
                <Box className={classes.chart}>
                  <InventoryChart />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <InventoryChart />
      </Container>
      {/* <Button
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
        ))} */}
    </Box>
  );
};

export default HomePage;
