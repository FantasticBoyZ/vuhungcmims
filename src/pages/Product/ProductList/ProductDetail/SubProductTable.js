import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';

const SubProductTable = ({subProductList}) => {
  const [selectedSubProductList, setSelectedSubProductList] = useState([]);
  // const selectedBulkActions = selectedSubProductList.length > 0;

  //     const handleSelectAllSubProductList = (event) => {
  //         setSelectedSubProductList(
  //           event.target.checked
  //             ? subProductList.map((subProductList) => subProductList.id)
  //             : []
  //         );
  //       };

  //       const handleSelectOnesubProductList = (event, subProductListId) => {
  //         if (!selectedSubProductList.includes(subProductListId)) {
  //           setSelectedSubProductList((prevSelected) => [
  //             ...prevSelected,
  //             subProductListId
  //           ]);
  //         } else {
  //           setSelectedSubProductList((prevSelected) =>
  //             prevSelected.filter((id) => id !== subProductListId)
  //           );
  //         }
  //       };

  //     const selectedSomeSubProductList =
  //     selectedSubProductList.length > 0 &&
  //     selectedSubProductList.length < subProductList.length;
  //   const selectedAllSubProductList =
  //     selectedSubProductList.length === subProductList.length;
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày khởi tạo</TableCell>
              <TableCell>Ngày hết hạn</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Kho</TableCell>
              <TableCell>Địa chỉ kho</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subProductList.map((subProduct, index) => {
            //   const isSubProductListSelected = selectedSubProductList.includes(
            //     subProduct.id,
            //   );
              return (
                <TableRow hover
                key={index}
                //   selected={isImportOrderSelected}
                selected={false}>
                  <TableCell>{subProduct.createdDate}</TableCell>
                  <TableCell>{subProduct.expiredDate}</TableCell>
                  <TableCell>{subProduct.quantity}</TableCell>
                  <TableCell>{subProduct.unitPrice}</TableCell>
                  <TableCell>{subProduct.warehouseName}</TableCell>
                  <TableCell>{subProduct.warehourseAddress}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {/* TODO: create table pagination */}
        </Table>
      </TableContainer>
    </Card>
  );
};

export default SubProductTable;
