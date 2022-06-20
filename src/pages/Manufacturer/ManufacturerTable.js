import { Edit, Info } from '@mui/icons-material';
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react'
import { useNavigate } from 'react-router-dom';

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

const ManufacturerTable = ({ manufacturerList }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleOnClickDetailManufacturer = (manufacturerId) => {
    console.log(manufacturerId)
    navigate(`/category/${manufacturerId}`)
  }

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
            <TableCell>Tên nhà cung cấp</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell align="left">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {manufacturerList.map((manufacturer) => {
            // TODO: làm selectedImportOrders
            //   const isImportOrderSelected = selectedImportOrders.includes(importOrder.id);
            return (
              <TableRow
                hover
                key={manufacturer.id}
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
                    {manufacturer.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {manufacturer.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {manufacturer.phone}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction='row' spacing={2} >
                    <Tooltip
                      title="Thông tin nhà cung cấp"
                      arrow
                    >
                      <Info fontSize="small" onClick={()=>handleOnClickDetailManufacturer(manufacturer.id)}/>
                    </Tooltip>
                    <Tooltip
                      title="Sửa nhà cung cấp"
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
  )
}

export default ManufacturerTable