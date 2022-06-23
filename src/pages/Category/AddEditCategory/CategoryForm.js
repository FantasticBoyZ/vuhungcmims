import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { saveCategory } from '@/slices/CategorySlice';
import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '30px 20px',
    marginBottom: '20px',
  },
  leftContainer: {
    padding: '20px',
  },
  rightContainer: {
    padding: '20px',
  },
  infoContainer: {
    display: 'flex',
    verticalAlign: 'center',
    justifyContent: 'center',
    padding: '12px',
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    width: '200px',
  },
  textfieldStyle: {
    flex: '5',
  },
  iconStyle: {
    fontSize: 'small',
    margin: '0 10px ',
  },
}));

const CategoryForm = (props) => {
    const { closePopup, category } = props
//   const { categoryId } = useParams();
  const navigate = useNavigate();
  // const [category, setCategory] = useState();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.categories }));
  const isAdd = !category;
  const initialFormValue = isAdd
    ? {
        name: '',
        description: '',
      }
    : {
        name: category?.name,
        description: category?.description,
      };

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(200, 'Tên danh mục không thể dài quá 200 kí tự')
      .required('Chưa nhập tên danh mục'),
  });

  const saveCategoryDetail = async (product) => {
    try {
      const actionResult = await dispatch(saveCategory(product));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (isAdd) {
        toast.success('Thêm danh mục thành công!');
        navigate('/category');
      } else {
        toast.success('Sửa danh mục thành công!');
        // navigate(`/category/detail/${categoryId}`);
      }
    } catch (error) {
      console.log('Failed to save category: ', error);
      if (isAdd) {
        toast.error('Thêm danh mục thất bại!');
      } else {
        toast.success('Sửa danh mục thất bại!');
      }
    }
  };

  const handleSubmit = (values) => {
    const newCategory = {
        id: category?.id,
        name: values.name,
        description: values.description,
      };
      console.log(values);
      saveCategoryDetail(newCategory);
      closePopup()
      
  };

  const handleOnClickExit = () => {
    // navigate(isAdd ? '/category' : `/category/detail/${categoryId}`);
  };
  return (
    <Formik
      initialValues={{
        ...initialFormValue,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={(values) => handleSubmit(values)}
    >
      <Form>
        {loading && !isAdd ? (
          <>Loading...</>
        ) : (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid
              xs={12}
              item
              // className={classes.leftContainer}
            >
              {!!category && (
                <Box>
                  <Box className={classes.infoContainer}>
                    <Typography className={classes.wrapIcon}>
                      Tên danh mục <InfoOutlined className={classes.iconStyle} />
                    </Typography>
                    <TextfieldWrapper
                      name="name"
                      fullWidth
                      id="name"
                      autoComplete="name"
                      autoFocus
                    />
                  </Box>
                  {console.log(category)}
                  <Box className={classes.infoContainer}>
                    <Typography className={classes.wrapIcon}>
                      Mô tả <InfoOutlined className={classes.iconStyle} />
                    </Typography>
                    <TextfieldWrapper
                      name="description"
                      fullWidth
                      multiline
                      rows={4}
                      id="description"
                      autoFocus
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
        {isAdd && (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid
              xs={12}
              item
              // className={classes.leftContainer}
            >
              <Box className={classes.infoContainer}>
                <Typography className={classes.wrapIcon}>
                  Tên danh mục <InfoOutlined className={classes.iconStyle} />
                </Typography>
                <TextfieldWrapper
                  name="name"
                  fullWidth
                  id="name"
                  autoComplete="name"
                  autoFocus
                />
              </Box>
              <Box className={classes.infoContainer}>
                <Typography className={classes.wrapIcon}>
                  Mô tả <InfoOutlined className={classes.iconStyle} />
                </Typography>
                <TextfieldWrapper
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  autoFocus
                />
              </Box>
            </Grid>
          </Grid>
        )}

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          padding="20px"
        >
          <ButtonWrapper variant="contained">Lưu</ButtonWrapper>
          {/* <Button
            onClick={() => handleOnClickExit()}
            variant="outlined"
          >
            Thoát
          </Button> */}
        </Stack>
      </Form>
    </Formik>
  );
};

export default CategoryForm;
