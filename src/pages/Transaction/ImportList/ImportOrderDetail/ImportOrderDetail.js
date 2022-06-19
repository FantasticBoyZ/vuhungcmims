import React from 'react';
import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import './style.css'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from "date-fns/locale";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ListConsignments from './ListConsignments';
const ImportOrderDetail = () => {

  const dataTest = {
    id: 1,
    orderCode: "Test001",
    createUser: "tui",
    confirmUser: null,
    manufacturer: "Công ty A",
    createdDate: new Date().getTime,
    confirmDate: null,
    status: "pending",
    inventory: "kho 1",
    note: "vai dong description nao do",
    listConsignments: [
      {
        id: "1",
        createDate: new Date().getTime(),
        billRefernce: "1234",
        manufactorName: "Trong",
        statusName: "pending"
      },
      {
        id: "2",
        createDate: new Date().getTime(),
        billRefernce: "1234",
        manufactorName: "Trong",
        statusName: "pending"
      },
      {
        id: "3",
        createDate: new Date().getTime(),
        billRefernce: "1234",
        manufactorName: "Trong",
        statusName: "pending"
      },
    ]
  }

  const [createdDate] = React.useState(new Date().getTime());
  const [confirmedDate] = React.useState(new Date().getTime());


  return (
    <>
      <div className='title-container'>
        <div className='title-order'>
          <div className='button-back'>
            <Button
              variant='text'
              startIcon={<ArrowBackIosNewIcon />}
              color='inherit'
            >Quay trở lại</Button>
          </div>
          <Box className='label-order-code'><b>Phiếu nhập kho số: </b>{dataTest.orderCode} </Box>
        </div>
        <div className='status-oder'>
          trạng thái đơn hàng ở đây
        </div>
      </div>
      <div className='container'>
        <div className='left-panel'>
          <Card className='panel-information '>
            <Typography >Thông tin nhà cung cấp</Typography>
            <Box className='manufacturer-info'>{dataTest.manufacturer}</Box>
            <hr />

            <Typography>VỊ TRÍ NHẬP: {dataTest.inventory}</Typography>
            <Box>ĐỊA CHỈ</Box>
            <Typography>Phường Phúc Xá - Quận Ba Đình - Hà Nội</Typography>
          </Card>
          <Card className='panel-information'>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              marginTop={1}
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <ListConsignments />
              </Grid>
            </Grid>
          </Card>
        </div>
        <div className='right-panel'>
          <Card className='panel-information'>
            <div className='panel-user-creates-order'>
              <Box>Người tạo đơn: <i> {dataTest.createUser}</i></Box>
              <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                <Typography>Ngày tạo đơn</Typography>
                <DateTimePicker
                  readOnly
                  value={createdDate}
                  renderInput={(params) => <TextField variant="standard" {...params} helperText={null} />}
                />
              </LocalizationProvider>
            </div>
            <div className='panel-user-confirms-order'>
              <Box>Người xác nhận: <i> {dataTest.confirmUser}</i></Box>
              <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
                <Typography>Ngày nhập kho</Typography>
                <DateTimePicker
                  readOnly
                  value={confirmedDate}
                  renderInput={(params) => <TextField variant="standard" {...params} helperText={null} />}
                />
              </LocalizationProvider>
            </div>
          </Card>
          <Card className='panel-information'>
            <Typography>GHI CHÚ</Typography>
            <div>{dataTest.note}</div>
          </Card>
        </div>
      </div>
    </>

  )
}

export default ImportOrderDetail