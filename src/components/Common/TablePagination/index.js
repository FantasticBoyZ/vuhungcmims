import { TablePagination } from '@mui/material';
import React from 'react';

const CustomTablePagination = ({ page , pages, rowsPerPage, totalRecord, handleChangePage, handleChangeRowsPerPage}) => {
  return (
    <TablePagination
      component="div"
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={totalRecord}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default CustomTablePagination;
