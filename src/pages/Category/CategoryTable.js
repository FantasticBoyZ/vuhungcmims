import { Edit, Info } from '@mui/icons-material';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  table: {
    textAlign: 'center',
    marginTop: theme.spacing(3),
    '& thead th': {
      fontWeight: '600',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:hover': {
      backgroundColor: '#fffbf2',
      cursor: 'pointer',
    },
  },
  cardStyle: {
    padding: '12px',
  },
}));

const CategoryTable = ({ categoryList }) => {
  const classes = useStyles();
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {/* <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={selectedAllImportOrders}
                indeterminate={selectedSomeImportOrders}
              />
            </TableCell> */}
            <TableCell>Tên danh mục</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell align="left">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoryList.map((category) => {
            // TODO: làm selectedImportOrders
            //   const isImportOrderSelected = selectedImportOrders.includes(importOrder.id);
            return (
              <TableRow
                hover
                key={category.id}
                //   selected={isImportOrderSelected}
                selected={false}
                // onClick={(value) => handleOnClickTableRow(importOrder.orderId)}
              >
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    //   checked={isImportOrderSelected}
                    checked={false}
                    // TODO: create function handle onclick checkbox
                    //   onChange={(event) =>
                    //     handleSelectOneImportOrder(event, importOrder.id)
                    //   }

                    //   value={isImportOrderSelected}
                    value={false}
                  />
                </TableCell> */}
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {category.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction='row' spacing={2} >
                    <Tooltip
                      title="info Category"
                      arrow
                    >
                      <Info fontSize="small" />
                    </Tooltip>
                    <Tooltip
                      title="Edit Category"
                      arrow
                    >
                      <Edit fontSize="small" />
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;
