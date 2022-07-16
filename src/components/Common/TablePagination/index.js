import { TablePagination } from '@mui/material';
import React from 'react';

const CustomTablePagination = ({
  page,
  pages,
  rowsPerPage,
  totalRecord,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  function defaultLabelDisplayedRows({ from, to, count }) {
    return `${from}–${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`;
  }

  return (
    <TablePagination
      component="div"
      labelRowsPerPage={'Số bản ghi trên một trang'}
      labelDisplayedRows={defaultLabelDisplayedRows}
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
