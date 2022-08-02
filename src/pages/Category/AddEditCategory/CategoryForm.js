import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import { getCategoryList, saveCategory, saveSubCategory } from '@/slices/CategorySlice';
import FormatDataUtils from '@/utils/formatData';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
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
    width: '450px',
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    width: '200px',
  },
  iconRequired: {
    color: 'red',
  },
  selectContainer: {
    width: '100%',
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectBox: {
    width: '290px',
  },
}));

const CategoryForm = (props) => {
  const { closePopup, category, allCategoryList } = props;
  //   const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.categories }));
  const isAdd = !category;
  const initialFormValue = isAdd
    ? {
        name: '',
        categoryId: '',
        description: '',
      }
    : {
        name: category?.name,
        categoryId: category?.categoryId || '',
        description: category?.description,
      };

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(200, 'Tên danh mục không thể dài quá 200 kí tự')
      .required('Chưa nhập tên danh mục'),
  });

  const getSelectedParent = () => {
    const categoryList = FormatDataUtils.getOptionWithIdandName(allCategoryList);
    setSelectedCategory(categoryList.find((item) => item.value == category?.categoryId));
  };


  const saveCategoryDetail = async (category) => {
    try {
      let actionResult;
      console.log(category)
      if(category.categoryId){
        // TODO: call api create subCategory
        actionResult = await dispatch(saveSubCategory(category));
      }else{
        actionResult = await dispatch(saveCategory(category));
      }
      
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

  const handleOnChangeCategory = (e) => {
    console.log(e);
  };

  const handleInputChangeCategory = (e) => {
    console.log(e);
  };

  const handleSubmit = (values) => {
    const newCategory = {
      id: category?.id,
      name: values.name,
      description: values.description,
      categoryId: values.categoryId
    };
    saveCategoryDetail(newCategory);
    closePopup();
  };

  const handleOnClickExit = () => {
    // navigate(isAdd ? '/category' : `/category/detail/${categoryId}`);
  };

  useEffect(() => {
    getSelectedParent();
  }, []);
  return (
    <Formik
      initialValues={{
        ...initialFormValue,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          {loading && !isAdd ? (
            <ProgressCircleLoading/>
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
                      <Typography
                        variant="span"
                        className={classes.wrapIcon}
                      >
                        Tên danh mục:<span className={classes.iconRequired}>*</span>
                      </Typography>
                      <TextfieldWrapper
                        name="name"
                        fullWidth
                        id="name"
                        autoComplete="name"
                        autoFocus
                      />
                    </Box>
                    {!!category.categoryId && (
                      <Box className={classes.selectContainer}>
                        <Typography variant="span">Danh mục cha:</Typography>
                        {!!allCategoryList && (
                          <Select
                            // classNamePrefix="select"
                            className={classes.selectBox}
                            placeholder="Chọn danh mục cha"
                            noOptionsMessage={() => <>Không có tìm thấy danh mục nào</>}
                            isClearable={true}
                            isSearchable={true}
                            isLoading={loading}
                            loadingMessage={() => <>Đang tìm kiếm danh mục cha...</>}
                            name="category"
                            value={selectedCategory}
                            options={FormatDataUtils.getOptionWithIdandName(
                              allCategoryList,
                            )}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            onChange={(e) => {
                              setFieldValue('categoryId', e?.value);
                            }}
                            onInputChange={handleInputChangeCategory}
                          />
                        )}
                      </Box>
                    )}

                    <Box className={classes.infoContainer}>
                      <Typography className={classes.wrapIcon}>Mô tả:</Typography>
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
                  <Typography
                    variant="span"
                    className={classes.wrapIcon}
                  >
                    Tên danh mục:<span className={classes.iconRequired}>*</span>
                  </Typography>
                  <TextfieldWrapper
                    name="name"
                    fullWidth
                    id="name"
                    autoComplete="name"
                    autoFocus
                  />
                </Box>
                <Box className={classes.selectContainer}>
                  <Typography variant="span">Danh mục cha:</Typography>
                  {!!allCategoryList && (
                    <Select
                      // classNamePrefix="select"
                      className={classes.selectBox}
                      placeholder="Chọn danh mục cha"
                      noOptionsMessage={() => <>Không có tìm thấy danh mục nào</>}
                      isClearable={true}
                      isSearchable={true}
                      isLoading={loading}
                      loadingMessage={() => <>Đang tìm kiếm danh mục cha...</>}
                      name="category"
                      options={FormatDataUtils.getOption(allCategoryList)}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      onChange={(e) => {
                        setFieldValue('categoryId', e?.value.id);
                      }}
                      onInputChange={handleInputChangeCategory}
                    />
                  )}
                </Box>
                <Box className={classes.infoContainer}>
                  <Typography className={classes.wrapIcon}>Mô tả:</Typography>
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
          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
