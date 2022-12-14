import { getManufacturerById } from '@/slices/ManufacturerSlice';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import Select from 'react-select';
import FormatDataUtils from '@/utils/formatData';
import CustomTablePagination from '@/components/Common/TablePagination';
import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';
const useStyles = makeStyles({
  cardHeader: {
    display: 'flex',
    padding: '20px 20px',
    marginBottom: '20px',
    justifyContent: 'space-between',
  },
  infoContainer: {
    display: 'block',
    padding: '20px',
    marginBottom: '20px',
  },
  infoProduct: {
    padding: '20px',
  },
  table: {
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
  },
});
const ManufacturerDetail = () => {
  const { manufacturerId } = useParams();
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.manufacturers }));
  const [selectedUnitMeasureList, setSelectedUnitMeasureList] = useState([]);
  const pages = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOnClickEdit = () => {
    navigate(`/manufacturer/edit/${manufacturerId}`);
  };

  const fetchManufacturerDetail = async () => {
    const params = {
      pageIndex: page + 1,
      pageSize: rowsPerPage,
      manufacturerId: manufacturerId,
    };
    try {
      const actionResult = await dispatch(getManufacturerById(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setManufacturer(dataResult.data.manufactor);
        setTotalRecord(dataResult.data.totalRecord);
      } else {
        navigate('/404');
      }
      console.log('dataResult', dataResult);
    } catch (error) {
      console.log('Failed to fetch manufacturer detail: ', error);
    }
  };

  useEffect(() => {
    fetchManufacturerDetail();
  }, [page, rowsPerPage]);

  useEffect(() => {
    console.log(!isNaN(manufacturerId))
    if (isNaN(manufacturerId)) {
      navigate('/404');
    } else {
      fetchManufacturerDetail();
    }
  }, []);

  console.log(manufacturer?.listProducts);
  return (
    <Grid>
      <Card className={classes.cardHeader}>
        <Stack>
          <Typography
            variant="h5"
            style={{ fontWeight: 'bold' }}
          >
            {manufacturer?.name}
          </Typography>
        </Stack>

        <Button
          onClick={() => handleOnClickEdit()}
          color="warning"
          variant="contained"
          startIcon={<CreateIcon />}
        >
          Ch???nh s???a
        </Button>
      </Card>

      <Card className={classes.infoContainer}>
        {loading && !manufacturer ? (
          <ProgressCircleLoading />
        ) : (
          <>
            <CardHeader title="Th??ng tin chi ti???t" />
            <CardContent>
              <Stack
                paddingX={3}
                spacing={2}
              >
                <Grid container>
                  <Grid
                    xs={2}
                    item
                  >
                    <Typography color="#696969">S??? ??i???n tho???i</Typography>
                  </Grid>
                  <Grid
                    xs={10}
                    item
                  >
                    <Typography>{manufacturer?.phone}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    xs={2}
                    item
                  >
                    <Typography color="#696969">Email</Typography>
                  </Grid>
                  <Grid
                    xs={10}
                    item
                  >
                    <Typography>{manufacturer?.email}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    xs={2}
                    item
                  >
                    <Typography color="#696969"> ?????a ch???</Typography>
                  </Grid>
                  <Grid
                    xs={10}
                    item
                  >
                    <Typography>{manufacturer?.addressManufactor}</Typography>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </>
        )}
      </Card>

      <Card className={classes.infoProduct}>
        {loading ? (
          <ProgressCircleLoading />
        ) : (
          <>
            {' '}
            <CardHeader title="C??c s???n ph???m cung c???p" />
            <CardContent>
              {totalRecord > 0 ? (
                <TableContainer>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>M?? s???n ph???m</TableCell>
                        <TableCell>T??n s???n ph???m</TableCell>
                        <TableCell align="center">Danh m???c</TableCell>
                        <TableCell align="center">????n v??? t??nh</TableCell>
                        <TableCell align="center">T???n kho</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {manufacturer?.listProducts.map((productByManufacturer, index) => {
                        // TODO: l??m selectedImportOrders
                        const newSelectdUnitMeasureList = selectedUnitMeasureList.slice();
                        return (
                          <TableRow
                            hover
                            key={productByManufacturer.id}
                            selected={false}
                          >
                            <TableCell>
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {productByManufacturer.productCode}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {productByManufacturer.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {productByManufacturer.categoryName}
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="center"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {productByManufacturer?.wrapUnitMeasure == null ? (
                                productByManufacturer?.unitMeasure
                              ) : (
                                <Stack
                                  direction="row"
                                  justifyContent="center"
                                >
                                  <Select
                                    classNamePrefix="select"
                                    isSearchable={false}
                                    defaultValue={
                                      FormatDataUtils.getOption([
                                        {
                                          number: 1,
                                          name: productByManufacturer.unitMeasure,
                                        },
                                        {
                                          number:
                                            productByManufacturer.numberOfWrapUnitMeasure,
                                          name: productByManufacturer.wrapUnitMeasure,
                                        },
                                      ])[0]
                                    }
                                    options={FormatDataUtils.getOption([
                                      {
                                        number: 1,
                                        name: productByManufacturer.unitMeasure,
                                      },
                                      {
                                        number:
                                          productByManufacturer.numberOfWrapUnitMeasure,
                                        name: productByManufacturer.wrapUnitMeasure,
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
                                        e.label ===
                                          productByManufacturer.wrapUnitMeasure &&
                                        newSelectdUnitMeasureList[index] !==
                                          productByManufacturer.wrapUnitMeasure
                                      ) {
                                        newSelectdUnitMeasureList[index] =
                                          productByManufacturer.wrapUnitMeasure;

                                        setSelectedUnitMeasureList(
                                          newSelectdUnitMeasureList,
                                        );
                                      }
                                      if (
                                        e.label === productByManufacturer.unitMeasure &&
                                        newSelectdUnitMeasureList[index] !==
                                          productByManufacturer.unitMeasure
                                      ) {
                                        newSelectdUnitMeasureList[index] =
                                          productByManufacturer.unitMeasure;

                                        setSelectedUnitMeasureList(
                                          newSelectdUnitMeasureList,
                                        );
                                      }
                                    }}
                                  />
                                  {selectedUnitMeasureList[index] ===
                                    productByManufacturer.wrapUnitMeasure && (
                                    <TooltipUnitMeasure
                                      quantity={
                                        productByManufacturer.quantity /
                                        productByManufacturer.numberOfWrapUnitMeasure
                                      }
                                      wrapUnitMeasure={
                                        productByManufacturer.wrapUnitMeasure
                                      }
                                      numberOfWrapUnitMeasure={
                                        productByManufacturer.numberOfWrapUnitMeasure
                                      }
                                      unitMeasure={productByManufacturer.unitMeasure}
                                      isConvert={false}
                                    />
                                  )}
                                </Stack>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {selectedUnitMeasureList[index] ===
                                productByManufacturer.wrapUnitMeasure
                                  ? FormatDataUtils.getRoundFloorNumber(
                                      productByManufacturer.quantity /
                                        productByManufacturer.numberOfWrapUnitMeasure,
                                      2,
                                    )
                                  : productByManufacturer.quantity}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <CustomTablePagination
                    page={page}
                    pages={pages}
                    rowsPerPage={rowsPerPage}
                    totalRecord={totalRecord}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableContainer>
              ) : (
                <>Ch??a c?? s???n ph???m n??o c???a nh?? s???n xu???t n??y trong kho</>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </Grid>
  );
};

export default ManufacturerDetail;
