import CustomTablePagination from '@/components/Common/TablePagination';
import { getCategoryDetail } from '@/slices/CategorySlice';
import { Box, Button, Card, Container, Stack, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SubCategoryTable from './SubCategoryTable';

const useStyles = makeStyles({
  buttonHeader: {
    padding: '24px',
    // marginBottom: '24px',
  },
  cardContainer: {
    display: 'block',
    // verticalAlign: 'center',
    // justifyContent: 'center',
    padding: '20px',
    marginBottom: '24px',
  },
});
const CategoryDetail = () => {
  const { categoryId } = useParams();
  const classes = useStyles();
  const [category, setCategory] = useState();
  const [subCategoryList, setSubCategoryList] = useState([]);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.categories }));
  // const category = {
  //   name: 'Gạch',
  //   description: 'Sản phẩm bền đẹp đạt chuẩn chất lượng Châu Âu',
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOnClickEdit = () => {
    navigate(`/category/edit/${categoryId}`)
  }

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
          setSubCategoryList(dataResult.data.subCategory);
          setTotalRecord(dataResult.data.totalRecord);
        }
        console.log('dataResult', dataResult);
      } catch (error) {
        console.log('Failed to fetch manufacturer detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);

    fetchCategoryDetail();
  }, []);

  return (
    <Container>
      {/* <Card className={classes.cardHeader}>
        <Typography variant="h5">Thông tin danh mục</Typography>
      </Card> */}
      <Stack
          direction="row"
          justifyContent='flex-end'
          spacing={2}
          className={classes.buttonHeader}
        >
          <Button
            onClick={() => handleOnClickEdit()}
            variant="contained"
          >
            Sửa danh mục
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/category')}
          >
            Thoát
          </Button>
        </Stack>
      <Card className={classes.cardContainer}>
        {loading ? (
          <>Loading...</>
        ) : (
          <Box>
            {category && (
              <Box>
                <Typography
                  fontSize="20px"
                  lineHeight={2}
                >
                  Danh mục: <strong>{category.name}</strong>
                </Typography>
                <Typography
                  fontSize="20px"
                  lineHeight={2}
                >
                  Mô tả:
                </Typography>
                <TextField
                  defaultValue={category.description}
                  multiline
                  rows={4}
                  fontSize="20px"
                  sx={{ width: '100%' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Card>
      <Card className={classes.cardContainer}>
        {subCategoryList && subCategoryList.length > 0 ? (
          <Box>
            <SubCategoryTable subCategoryList={subCategoryList} />
            <CustomTablePagination
              page={page}
              pages={pages}
              rowsPerPage={rowsPerPage}
              totalRecord={totalRecord}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Box>
        ): (<>Danh mục chưa có danh mục phụ nào</>)}
      </Card>
    </Container>
  );
};

export default CategoryDetail;
