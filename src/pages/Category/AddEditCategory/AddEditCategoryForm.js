import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { getCategoryDetail } from '@/slices/CategorySlice';
import { Info } from '@mui/icons-material';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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

const AddEditCategoryForm = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState();
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.categories }));
  const isAdd = !categoryId;
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

  const handleSubmit = (values) => {};

  const handleOnClickExit = () => {
    navigate(isAdd ? '/category' : `/category/detail/${categoryId}`);
  };

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        const params = {
          categoryId: categoryId,
          pageIndex: page + 1,
          pageSize: rowsPerPage,
        };
        const actionResult = await dispatch(getCategoryDetail(params));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setCategory(dataResult.data.category);
          console.log(category);
        }
        console.log('dataResult', dataResult);
      } catch (error) {
        console.log('Failed to fetch category detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);

    fetchCategoryDetail();
  }, []);

  return (
    // TODO: fix bug chưa điền thông tin vào category
    <Container maxWidth="lg">
      {/* <Card className={classes.cardHeader}>
        <Typography variant='h5'>Thêm danh mục</Typography>
      </Card> */}
      <Card>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid
            xs={12}
            item
          >
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
                              Tên danh mục <Info className={classes.iconStyle} />
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
                              Mô tả <Info className={classes.iconStyle} />
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
                          Tên danh mục <Info className={classes.iconStyle} />
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
                          Mô tả <Info className={classes.iconStyle} />
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
                  <Button
                    onClick={() => handleOnClickExit()}
                    variant="outlined"
                  >
                    Thoát
                  </Button>
                </Stack>
              </Form>
            </Formik>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default AddEditCategoryForm;
