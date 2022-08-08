import React, { Fragment, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormatDataUtils from '@/utils/formatData';
import { getInventoryCheckingHistoryDetail } from '@/slices/InventoryCheckingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import Select from 'react-select';

const useStyles = makeStyles({
  labelInfo: {
    color: '#696969',
  },
  contentInfo: {
    color: '#000000',
    fontWeight: '400 !important',
  },
  table: {
    textAlign: 'center',
    // padding: theme.spacing(2),
    '& thead th': {
      // fontWeight: '600',
      // color: theme.palette.primary.main,
      backgroundColor: '#DCF4FC',
    },
    '& tbody td': {
      // fontWeight: '300',
    },
    '& tbody tr:hover': {
      // backgroundColor: '#fffbf2',
      cursor: 'pointer',
    },
  },
  rowConsignment: {
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    boxShadow: '15px',
  },
  tableCellConsignment: {
    padding: '0 !important',
  },
  tableCosignment: {
    // marginTop: '0',
    '& thead th': {
      // fontWeight: '600',
      // color: theme.palette.primary.main,
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
    },
  },
  cardTable: {
    minHeight: '70vh',
    position: 'relative',
  },
  totalDifferentContainer: {
    width: '35%',
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
  labelTotalDifferent: {
    fontSize: '20px !important',
  },
  totalDifferent: {
    fontSize: '20px !important',
  },
  unitMeasureSelectBox: {
    width: '100px',
  },
});

const productList = [
  {
    productCode: 'Gach32',
    productName: 'Gạch xây',
    unitMeasure: 'Viên',
    wrapUnitMeasure: 'Hộp',
    numberOfWrapUnitMeasure: 10,
    unitPrice: 70000,
    consignmentList: [
      {
        consignmentId: 1,
        importDate: '16/07/2022',
        expirationDate: '30/12/2023',
        quantity: 200,
        quantityRealtity: 189,
        differentAmount: -770000,
      },
    ],
  },
  {
    productCode: 'Gach23',
    productName: 'Gạch xây',
    unitMeasure: 'Viên',
    wrapUnitMeasure: 'Hộp',
    numberOfWrapUnitMeasure: 10,
    unitPrice: 70000,
    consignmentList: [
      {
        consignmentId: 1,
        importDate: '16/07/2022',
        expirationDate: '30/12/2023',
        quantity: 200,
        quantityRealtity: 189,
        differentAmount: -770000,
      },
      {
        consignmentId: 2,
        importDate: '16/10/2022',
        expirationDate: '30/12/2024',
        quantity: 200,
        quantityRealtity: 202,
        differentAmount: 140000,
      },
    ],
  },
];
const InventoryCheckingDetail = () => {
  const { inventoryCheckingId } = useParams();
  const classes = useStyles();
  const [inventoryChecking, setInventoryChecking] = useState();
  const [selectedUnitMeasureList, setSelectedUnitMeasureList] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.inventoryChecking }));

  const fetchInventoryCheckingDetail = async () => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
      };
      const actionResult = await dispatch(
        getInventoryCheckingHistoryDetail(inventoryCheckingId),
      );
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        setInventoryChecking(dataResult.data.inventoryCheckingHistoryDetail);
      }
    } catch (error) {
      console.log('Failed to fetch inventoryChecking detail: ', error);
    }
  };

  useEffect(() => {
    fetchInventoryCheckingDetail();
  }, []);

  return (
    <Box>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Box>
          {inventoryChecking && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                xs={12}
                item
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">Thông tin kiểm kho</Typography>
                    <Stack
                      spacing={2}
                      p={2}
                    >
                      <Grid container>
                        <Grid
                          xs={2}
                          item
                        >
                          <Typography className={classes.labelInfo}>Người tạo</Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {inventoryChecking.fullName +
                              (inventoryChecking.userName
                                ? '(' + inventoryChecking.userName + ')'
                                : '')}
                          </Typography>
                        </Grid>
                        <Grid
                          xs={2}
                          item
                        >
                          <Typography className={classes.labelInfo}>
                            Ngày kiểm kho
                          </Typography>
                        </Grid>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {FormatDataUtils.formatDate(inventoryChecking.createDate)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={2}
                          item
                        >
                          <Typography className={classes.labelInfo}>Kho</Typography>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {inventoryChecking.wareHouseName}
                          </Typography>
                        </Grid>
                        <Grid
                          xs={6}
                          item
                        ></Grid>
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={12}
                item
              >
                <Card>
                  <CardContent className={classes.cardTable}>
                    <Typography variant="h6">Các sản phẩm kiểm kho</Typography>
                    <TableContainer>
                      {inventoryChecking?.listProduct && (
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell>STT</TableCell>
                              <TableCell>Mã sản phẩm</TableCell>
                              <TableCell>Tên sản phẩm</TableCell>
                              <TableCell>Đơn vị</TableCell>
                              {/* <TableCell align="center">Số lượng</TableCell> */}
                              <TableCell align="center">Đơn giá</TableCell>
                              <TableCell></TableCell>
                              {/* <TableCell align="center">Thành tiền</TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {inventoryChecking?.listProduct.map((product, index) => {
                              const newSelectdUnitMeasureList =
                                selectedUnitMeasureList.slice();
                              return (
                                <Fragment key={index}>
                                  <TableRow
                                    hover
                                    //   selected={islistProductselected}
                                    selected={false}
                                  >
                                    {/* TODO: Sửa phần index khi phân trang */}
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{product?.productCode}</TableCell>
                                    <TableCell>{product?.name}</TableCell>
                                    <TableCell
                                      align="center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      {product.wrapUnitMeasure == null ? (
                                        product.unitMeasure
                                      ) : (
                                        <Select
                                          classNamePrefix="select"
                                          isSearchable={false}
                                          className={classes.unitMeasureSelectBox}
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
                                            // console.log(e.label);
                                            if (
                                              e.label === product.wrapUnitMeasure &&
                                              newSelectdUnitMeasureList[index] !==
                                                product.wrapUnitMeasure
                                            ) {
                                              newSelectdUnitMeasureList[index] =
                                                product.wrapUnitMeasure;

                                              setSelectedUnitMeasureList(
                                                newSelectdUnitMeasureList,
                                              );
                                            }
                                            if (
                                              e.label === product.unitMeasure &&
                                              newSelectdUnitMeasureList[index] !==
                                                product.unitMeasure
                                            ) {
                                              newSelectdUnitMeasureList[index] =
                                                product.unitMeasure;

                                              setSelectedUnitMeasureList(
                                                newSelectdUnitMeasureList,
                                              );
                                            }
                                            // console.log(selectedUnitMeasureList);
                                          }}
                                        />
                                      )}
                                    </TableCell>
                                    {/* <TableCell align="center">{product?.quantity}</TableCell> */}
                                    <TableCell align="center">
                                      {product?.unitPrice
                                        ? FormatDataUtils.formatCurrency(
                                            selectedUnitMeasureList[index] ===
                                              product.wrapUnitMeasure
                                              ? FormatDataUtils.getRoundNumber(
                                                  product?.unitPrice *
                                                    product.numberOfWrapUnitMeasure,
                                                  1,
                                                )
                                              : product?.unitPrice,
                                          )
                                        : FormatDataUtils.formatCurrency(0)}
                                    </TableCell>
                                    <TableCell></TableCell>
                                    {/* <TableCell align="center">
                            {FormatDataUtils.formatCurrency(
                              product?.quantity * product?.unitPrice,
                            )}
                          </TableCell> */}
                                  </TableRow>
                                  <TableRow className={classes.rowConsignment}>
                                    <TableCell
                                      className={classes.tableCellConsignment}
                                    ></TableCell>
                                    <TableCell
                                      colSpan={4}
                                      className={classes.tableCellConsignment}
                                    >
                                      <Table className={classes.tableCosignment}>
                                        {/* <TableHead> */}

                                        {/* </TableHead> */}
                                        <TableBody>
                                          <TableRow>
                                            <TableCell>Ngày nhập</TableCell>
                                            <TableCell>Hạn lưu kho</TableCell>
                                            <TableCell align="center">
                                              Số lượng đầu
                                            </TableCell>
                                            <TableCell align="center">
                                              Số lượng thực tế
                                            </TableCell>
                                            <TableCell align="center">
                                              Giá trị chênh lệch
                                            </TableCell>
                                          </TableRow>
                                          {product?.listConsignment.map(
                                            (consignment, indexConsignment) => (
                                              <TableRow
                                                key={indexConsignment}
                                                // hover
                                              >
                                                <TableCell>
                                                  {FormatDataUtils.formatDate(
                                                    consignment?.importDate,
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {consignment?.expirationDate
                                                    ? FormatDataUtils.formatDate(
                                                        consignment?.expirationDate,
                                                      )
                                                    : 'Không có'}
                                                </TableCell>
                                                <TableCell align="center">
                                                  {selectedUnitMeasureList[index] ===
                                                  product.wrapUnitMeasure
                                                    ? FormatDataUtils.getRoundFloorNumber(
                                                        consignment?.instockQuantity /
                                                          product.numberOfWrapUnitMeasure,
                                                        2,
                                                      )
                                                    : consignment?.instockQuantity}
                                                </TableCell>
                                                <TableCell align="center">
                                                  {selectedUnitMeasureList[index] ===
                                                  product.wrapUnitMeasure
                                                    ? FormatDataUtils.getRoundFloorNumber(
                                                        consignment?.realityQuantity /
                                                          product.numberOfWrapUnitMeasure,
                                                        2,
                                                      )
                                                    : consignment?.realityQuantity}
                                                </TableCell>
                                                <TableCell align="center">
                                                  {consignment?.differentAmout &&
                                                    FormatDataUtils.formatCurrency(
                                                      consignment?.differentAmout,
                                                    )}
                                                </TableCell>
                                              </TableRow>
                                            ),
                                          )}
                                        </TableBody>
                                      </Table>
                                    </TableCell>
                                    <TableCell></TableCell>
                                    {/* <TableCell className={classes.tableCellConsignment}></TableCell> */}
                                  </TableRow>
                                </Fragment>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </TableContainer>
                    <Box className={classes.totalDifferentContainer}>
                      <Divider />
                      <Stack
                        direction="row"
                        p={2}
                        justifyContent="space-between"
                      >
                        <Typography className={classes.labelTotalDifferent}>
                          Tổng chênh lệch:
                        </Typography>
                        <Typography className={classes.totalDifferent}>
                          <b>{FormatDataUtils.formatCurrency(inventoryChecking.totalDifferentAmout)}</b>
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default InventoryCheckingDetail;
