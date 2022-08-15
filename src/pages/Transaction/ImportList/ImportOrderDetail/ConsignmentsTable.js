import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';
import FormatDataUtils from '@/utils/formatData';
import {
  Stack,
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

const ConsignmentsTable = ({ listConsignments }) => {
  const classes = useStyles();
  const [selectedUnitMeasureList, setSelectedUnitMeasureList] = useState([]);
  const dataTest = {
    id: 1,
    productCode: 'GACH23',
    productName: 'Gạch men 60x60',
    unitMeasure: 'Viên',
    quantity: 54,
    unitPrice: 100000,
  };
  const formatCurrency = (value) =>
    value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã sản phẩm</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Hạn lưu kho</TableCell>
            <TableCell>Đơn vị</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Đơn giá</TableCell>
            <TableCell>Thành tiền</TableCell>
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
                <TableCell>{consignment?.productCode}</TableCell>
                <TableCell>{consignment?.productName}</TableCell>
                <TableCell>
                  {consignment?.expirationDate
                    ? FormatDataUtils.formatDate(consignment?.expirationDate)
                    : 'Không có'}
                </TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {consignment.wrapUnitMeasure == null ? (
                    consignment.unitMeasure
                  ) : (
                    <Stack
                      direction="row"
                      justifyContent="left"
                    >
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
                            newSelectdUnitMeasureList[index] !==
                              consignment.wrapUnitMeasure
                          ) {
                            newSelectdUnitMeasureList[index] =
                              consignment.wrapUnitMeasure;
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
                      {selectedUnitMeasureList[index] === consignment.wrapUnitMeasure && (
                        <TooltipUnitMeasure
                          wrapUnitMeasure={consignment.wrapUnitMeasure}
                          numberOfWrapUnitMeasure={consignment.numberOfWrapUnitMeasure}
                          unitMeasure={consignment.unitMeasure}
                          isConvert={false}
                        />
                      )}
                    </Stack>
                  )}
                </TableCell>
                <TableCell>
                  {selectedUnitMeasureList[index] === consignment.wrapUnitMeasure ? (
                    <TooltipUnitMeasure
                      quantity={
                        consignment?.quantity / consignment.numberOfWrapUnitMeasure
                      }
                      wrapUnitMeasure={consignment.wrapUnitMeasure}
                      numberOfWrapUnitMeasure={consignment.numberOfWrapUnitMeasure}
                      unitMeasure={consignment.unitMeasure}
                      isConvert={true}
                      value={FormatDataUtils.getRoundFloorNumber(
                        consignment?.quantity / consignment.numberOfWrapUnitMeasure,
                        2,
                      )}
                    />
                  ) : (
                    consignment?.quantity
                  )}
                </TableCell>
                <TableCell>
                  {selectedUnitMeasureList[index] === consignment.wrapUnitMeasure
                    ? formatCurrency(
                        consignment?.unitPrice * consignment.numberOfWrapUnitMeasure,
                      )
                    : formatCurrency(consignment?.unitPrice)}
                </TableCell>
                <TableCell>
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

export default ConsignmentsTable;
