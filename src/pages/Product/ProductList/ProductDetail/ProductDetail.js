import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import ProductInformation from '@/pages/Product/ProductList/ProductDetail//ProductInformation';
import SubProductTable from '@/pages/Product/ProductList/ProductDetail//SubProductTable';
import { getProductDetail } from '@/slices/ProductSlice';
import FormatDataUtils from '@/utils/formatData';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

const useStyles = makeStyles({
  labelInfo: {
    color: '#696969',
  },
  contentInfo: {
    color: '#000000',
    fontWeight: '400 !important',
  },
});

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [subProductList, setSubProductList] = useState([]);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [productQuantity, setProductQuantity] = useState(1);
  const classes = useStyles();

  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => ({ ...state.products }));

  // const productClone = {
  //   name: 'Thép cây Việt Nhật D16',
  //   productCode: 'SP001',
  //   categoryName: 'Vật liệu thô',
  //   subCategoryName: 'Vật liệu thô 50x50',
  //   unitMeasure: 'cái',
  //   inStock: '100',
  //   manufacturerName: 'Công ty Pharmedic',
  //   description:
  //     'Thép cây Việt Nhật D16 là sản phẩm  được sản xuất từ nguồn nguyên liệu ổn định chất lượng cao theo dây chuyền công nghệ tiên tiến của Tây..',
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const params = {
          productId: productId,
          pageIndex: page + 1,
          pageSize: rowsPerPage,
        };
        const actionResult = await dispatch(getProductDetail(params));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setTotalRecord(dataResult.data.totalRecord);
          setSubProductList(dataResult.data.consignment);
          setProduct(dataResult.data.product);
          setProductQuantity(dataResult.data.product.quantity);
        }
        console.log('dataResult', dataResult);
        console.log('product', dataResult.data.product);
        console.log(dataResult);
        console.log('products', products);
      } catch (error) {
        console.log('Failed to fetch product detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);
    console.log('product', product);
    fetchProductDetail();
  }, [page, rowsPerPage]);

  return (
    <>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Grid
          container
          spacing={2}
        >
          <Grid
            xs={12}
            item
          >
            {!!product && <ProductInformation product={product} />}
          </Grid>
          <Grid
            item
            xs={12}
          >
            {/* <Typography variant='h5'>Danh sách lô hàng </Typography> */}
            {!!totalRecord && totalRecord > 0 ? (
              <Card>
                <CardContent>
                  <Typography variant="h6">Thông tin kho hàng</Typography>
                  <CardContent>
                    <Grid container>
                      <Grid xs={4} item>
                        <Grid container>
                          <Grid
                            xs={1}
                            item
                          ></Grid>
                          <Grid
                            xs={6}
                            item
                          >
                            <Typography className={classes.labelInfo}>
                              Đơn vị tính
                            </Typography>
                          </Grid>
                          <Grid
                            xs={5}
                            item
                          >
                            <Box className={classes.contentInfo}>
                              {product.wrapUnitMeasure == null ? (
                                product.unitMeasure
                              ) : (
                                <Select
                                  classNamePrefix="select"
                                  defaultValue={
                                    FormatDataUtils.getOption([
                                      {
                                        number: 1,
                                        name: product.unitMeasure,
                                      },
                                      {
                                        number: product.numberOfWrapUnitMeasure,
                                        name: product.wrapUnitMeasure,
                                      },
                                    ])[0]
                                  }
                                  options={FormatDataUtils.getOption([
                                    {
                                      number: 1,
                                      name: product.unitMeasure,
                                    },
                                    {
                                      number: product.numberOfWrapUnitMeasure,
                                      name: product.wrapUnitMeasure,
                                    },
                                  ])}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  onChange={(e) => {
                                    if (
                                      e.value.number === product.numberOfWrapUnitMeasure
                                    ) {
                                      setProductQuantity(
                                        product.quantity / e.value.number,
                                      );
                                    } else {
                                      setProductQuantity(product.quantity);
                                    }
                                  }}
                                />
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid xs={4} item>
                        <Grid container>
                          <Grid
                            xs={1}
                            item
                          ></Grid>
                          <Grid
                            xs={6}
                            item
                          >
                            <Typography className={classes.labelInfo}>
                              Số lượng
                            </Typography>
                          </Grid>
                          <Grid
                            xs={5}
                            item
                          >
                            <Typography className={classes.contentInfo}>
                              {productQuantity || 0}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <SubProductTable subProductList={subProductList} />
                  {/* <CustomTablePagination
                  page={page}
                  pages={pages}
                  rowsPerPage={rowsPerPage}
                  totalRecord={totalRecord}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                /> */}
                </CardContent>
              </Card>
            ) : (
              <Card> Sản phẩm chưa có lô hàng nào</Card>
            )}
          </Grid>
        </Grid>
        // <Container maxWidth="lg">
        //   {!!product && <ProductInformation product={product} />}

        //   <Grid
        //     container
        //     direction="row"
        //     justifyContent="center"
        //     alignItems="stretch"
        //   >
        //     <Grid
        //       item
        //       xs={12}
        //     >
        //       {/* <Typography variant='h5'>Danh sách lô hàng </Typography> */}
        //       {!!totalRecord && totalRecord > 0 ? (
        //         <Card>
        //           <SubProductList subProductList={subProductList} />
        //           <CustomTablePagination
        //             page={page}
        //             pages={pages}
        //             rowsPerPage={rowsPerPage}
        //             totalRecord={totalRecord}
        //             handleChangePage={handleChangePage}
        //             handleChangeRowsPerPage={handleChangeRowsPerPage}
        //           />
        //         </Card>
        //       ) : (
        //         <Card> Sản phẩm chưa có lô hàng nào</Card>
        //       )}
        //     </Grid>
        //   </Grid>
        // </Container>
      )}
    </>
  );
};

export default ProductDetail;
