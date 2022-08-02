import FormatDataUtils from '@/utils/formatData';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const useStyles = makeStyles((theme) => ({
  table: {
    textAlign: 'center',
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
    '& tbody tr:hover': {
      // cursor: 'pointer',
    },
  },
}));

const TempReturnTable = ({ listConsignments }) => {
  const classes = useStyles();
  const [selectedUnitMeasureList, setSelectedUnitMeasureList] = useState([]);

  const formatCurrency = (value) =>
    value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell align='center'>Đơn vị</TableCell>
            <TableCell align='center'>Số lượng</TableCell>
            <TableCell align='center'>Đơn giá</TableCell>
            <TableCell align='center'>Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listConsignments.map((consignment, index) => {
            const newSelectdUnitMeasureList = selectedUnitMeasureList.slice();
            return (
              <TableRow
                hover
                key={index}
                //   selected={islistConsignmentselected}
                selected={false}
              >
                {/* TODO: Sửa phần index khi phân trang */}
                <TableCell>{index + 1}</TableCell>
                <TableCell>{consignment?.productName}</TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  align='center'
                >
                  {consignment.wrapUnitMeasure == null ? (
                    consignment.unitMeasure
                  ) : (
                    <Select
                      classNamePrefix="select"
                      defaultValue={
                        FormatDataUtils.getOption([
                          {
                            number: 1,
                            name: consignment.unitMeasure,
                          },
                          {
                            number: consignment.numberOfWrapUnitMeasure,
                            name: consignment.wrapUnitMeasure,
                          },
                        ])[0]
                      }
                      options={FormatDataUtils.getOption([
                        {
                          number: 1,
                          name: consignment.unitMeasure,
                        },
                        {
                          number: consignment.numberOfWrapUnitMeasure,
                          name: consignment.wrapUnitMeasure,
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
                          e.label === consignment.wrapUnitMeasure &&
                          newSelectdUnitMeasureList[index] !== consignment.wrapUnitMeasure
                        ) {
                          newSelectdUnitMeasureList[index] = consignment.wrapUnitMeasure;
                          // console.log(
                          //   'wrapUnitMeasure',
                          //   newSelectdUnitMeasureList[index],
                          // );
                          setSelectedUnitMeasureList(newSelectdUnitMeasureList);
                        }
                        if (
                          e.label === consignment.unitMeasure &&
                          newSelectdUnitMeasureList[index] !== consignment.unitMeasure
                        ) {
                          newSelectdUnitMeasureList[index] = consignment.unitMeasure;
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
                <TableCell align='center'>
                  {consignment?.quantity}
                </TableCell>
                <TableCell align='center'>
                  {formatCurrency(consignment?.unitPrice)}
                </TableCell>
                <TableCell align='center'>
                  {formatCurrency(consignment?.quantity * consignment?.unitPrice)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TempReturnTable;
