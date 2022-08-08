import FormatDataUtils from '@/utils/formatData';
import { InfoOutlined } from '@mui/icons-material';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { Fragment, useState } from 'react';
import Select from 'react-select';

const useStyles = makeStyles((theme) => ({
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
}));

const ExportProductTable = ({ productList }) => {
  const classes = useStyles();
  const [selectedUnitMeasureList, setSelectedUnitMeasureList] = useState([]);
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã sản phẩm</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Đơn vị</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="center">Đơn giá</TableCell>
            <TableCell align="center">Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productList.map((product, index) => {
            const newSelectdUnitMeasureList = selectedUnitMeasureList.slice();
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
                  <TableCell>{product?.productName}</TableCell>
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
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
                          // console.log(e.label);
                          if (
                            e.label === product.wrapUnitMeasure &&
                            newSelectdUnitMeasureList[index] !== product.wrapUnitMeasure
                          ) {
                            newSelectdUnitMeasureList[index] = product.wrapUnitMeasure;
                            // console.log(
                            //   'wrapUnitMeasure',
                            //   newSelectdUnitMeasureList[index],
                            // );
                            setSelectedUnitMeasureList(newSelectdUnitMeasureList);
                          }
                          if (
                            e.label === product.unitMeasure &&
                            newSelectdUnitMeasureList[index] !== product.unitMeasure
                          ) {
                            newSelectdUnitMeasureList[index] = product.unitMeasure;
                            // console.log(
                            //   'unitMeasure',
                            //   newSelectdUnitMeasureList[index],
                            // );
                            setSelectedUnitMeasureList(newSelectdUnitMeasureList);
                          }
                          // console.log(selectedUnitMeasureList);
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {selectedUnitMeasureList[index] === product.wrapUnitMeasure
                      ? FormatDataUtils.getRoundFloorNumber(
                          product?.quantity / product.numberOfWrapUnitMeasure,
                          2,
                        )
                      : product?.quantity}
                    {selectedUnitMeasureList[index] === product.wrapUnitMeasure &&
                      !!product.wrapUnitMeasure && (
                        <Tooltip
                          title={
                            product.quantity / product.numberOfWrapUnitMeasure -
                            ((product.quantity / product.numberOfWrapUnitMeasure) % 1) +
                            ' ' +
                            product.wrapUnitMeasure +
                            ' ' +
                            Math.floor(
                              ((product.quantity / product.numberOfWrapUnitMeasure) % 1) *
                                product.numberOfWrapUnitMeasure,
                            ) +
                            ' ' +
                            product.unitMeasure
                          }
                        >
                          <IconButton>
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      )}
                  </TableCell>
                  <TableCell align="center">
                    {selectedUnitMeasureList[index] === product.wrapUnitMeasure
                      ? FormatDataUtils.formatCurrency(
                          product?.unitPrice * product.numberOfWrapUnitMeasure,
                        )
                      : FormatDataUtils.formatCurrency(product?.unitPrice)}
                  </TableCell>
                  <TableCell align="center">
                    {FormatDataUtils.formatCurrency(
                      product?.quantity * product?.unitPrice,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowConsignment}>
                  <TableCell className={classes.tableCellConsignment}></TableCell>
                  <TableCell
                    colSpan={5}
                    className={classes.tableCellConsignment}
                  >
                    <Table className={classes.tableCosignment}>
                      {/* <TableHead> */}

                      {/* </TableHead> */}
                      <TableBody>
                        <TableRow>
                          <TableCell>Vị trí</TableCell>
                          <TableCell>Ngày nhập</TableCell>
                          <TableCell>Hạn lưu kho</TableCell>
                          <TableCell align="center">Số lượng</TableCell>
                        </TableRow>
                        {product?.consignmentList.map((consignment, indexConsignment) => (
                          <TableRow
                            key={indexConsignment}
                            // hover
                          >
                            <TableCell>{consignment?.warehouseName}</TableCell>
                            <TableCell>
                              {FormatDataUtils.formatDate(consignment?.importDate)}
                            </TableCell>
                            <TableCell>
                              {consignment?.expirationDate
                                ? FormatDataUtils.formatDate(consignment?.expirationDate)
                                : 'Không có'}
                            </TableCell>
                            <TableCell align="center">
                              {selectedUnitMeasureList[index] === product.wrapUnitMeasure
                                ? FormatDataUtils.getRoundFloorNumber(
                                    consignment?.quantity /
                                      product.numberOfWrapUnitMeasure,
                                    2,
                                  )
                                : consignment?.quantity}
                              {selectedUnitMeasureList[index] ===
                                product.wrapUnitMeasure &&
                                !!product.wrapUnitMeasure && (
                                  <Tooltip
                                    title={
                                      consignment.quantity /
                                        product.numberOfWrapUnitMeasure -
                                      ((consignment.quantity /
                                        product.numberOfWrapUnitMeasure) %
                                        1) +
                                      ' ' +
                                      product.wrapUnitMeasure +
                                      ' ' +
                                      Math.floor(
                                        ((consignment.quantity /
                                          product.numberOfWrapUnitMeasure) %
                                          1) *
                                          product.numberOfWrapUnitMeasure,
                                      ) +
                                      ' ' +
                                      product.unitMeasure
                                    }
                                  >
                                    <IconButton>
                                      <InfoOutlined />
                                    </IconButton>
                                  </Tooltip>
                                )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell className={classes.tableCellConsignment}></TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExportProductTable;
