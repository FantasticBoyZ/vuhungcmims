import { Button, Card, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useState } from 'react'
import Select from 'react-select'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check';
import './style.css'
import { format } from 'date-fns'
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { vi } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ImportGoods = () => {


  const manufacturerData = [
    {
      id: 1,
      name: "Vu Hung"
    },
    {
      id: 2,
      name: "Ha Long"
    },
    {
      id: 3,
      name: "Ngoc Sang"
    },
    {
      id: 4,
      name: "Gom Dat Viet"
    },
  ];

  const productData = [
    {
      id: 1,
      manufacturerId: 1,
      productCode: 'TEST001',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: "vien",
      wrapUnitMeasure: "Hop",
      numberOfWrapUnitMeasure: 4
    },
    {
      id: 2,
      manufacturerId: 1,
      productCode: 'TEST002',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: "vien",
      wrapUnitMeasure: "Hop",
      numberOfWrapUnitMeasure: 4
    },
    {
      id: 3,
      manufacturerId: 1,
      productCode: 'TEST003',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: "vien",
      wrapUnitMeasure: "Hop",
      numberOfWrapUnitMeasure: 4
    },
    {
      id: 4,
      manufacturerId: 1,
      productCode: 'TEST004',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: "vien",
      wrapUnitMeasure: "Hop",
      numberOfWrapUnitMeasure: 4
    },
    {
      id: 5,
      manufacturerId: 1,
      productCode: 'TEST005',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: "vien",
      wrapUnitMeasure: null,
      numberOfWrapUnitMeasure: null
    },
  ];

  const warehouseData = [
    {
      id: 1,
      name: "Kho 1"
    },
    {
      id: 2,
      name: "Kho 2"
    },
    {
      id: 3,
      name: "Kho 3"
    },
    {
      id: 4,
      name: "Kho 4"
    },
  ]
  const getOption = (listData) => {
    return listData.map((data) => {
      return {
        value: data,
        label: data.name
      }
    })
  };
  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  };
  const [testChangeDate, setTestChangeDate] = useState()

  const testProductSelectedData = {
    id: 1,
    manufacturerId: 1,
    productCode: 'TEST001',
    name: 'Gạch Gốm Đất Việt 50x50',
    unitMeasure: "vien",
    wrapUnitMeasure: "hop",
    numberOfWrapUnitMeasure: 4
  }
  const testProductSelectedData2 = {
    id: 2,
    manufacturerId: 1,
    productCode: 'TEST002',
    name: 'Gạch Men Gốm Đất Việt 40x40',
    unitMeasure: "vien",
    wrapUnitMeasure: null,
    numberOfWrapUnitMeasure: null
  }

  return (
    <div className='container'>
      <div className='left-container'>

        <Card className='card-container'>
          <div className='label'>
            Thông tin nhà cung cấp
          </div>
          <Select
            classNamePrefix="select"
            placeholder='Chọn nhà cung cấp...'
            isClearable={true}
            isSearchable={true}
            name="manufacturer"
            options={getOption(manufacturerData)}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
        </Card>
        <Card className='card-container'>
          <div className='label'>
            Thông tin các sản phẩm
          </div>
          <Select
            classNamePrefix="select"
            placeholder='Chọn sản phẩm của nhà cung cấp phía trên...'
            isClearable={true}
            isSearchable={true}
            name="product"
            options={getOption(productData)}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
          <hr />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>STT</TableCell>
                  <TableCell>Mã sản phẩm</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Ngày hết hạn</TableCell>
                  <TableCell>Đơn vị tính</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Đơn giá</TableCell>
                  <TableCell>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key={1}>
                  <TableCell>
                    <IconButton aria-label="delete" size="large">
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>TEST001</TableCell>
                  <TableCell>Gạch vjp pro</TableCell>
                  <TableCell>
                    <LocalizationProvider className='date-picker'
                      locale={vi}
                      dateAdapter={AdapterDateFns}
                    >
                      <DatePicker
                        value={testChangeDate}
                        onChange={(value) => setTestChangeDate(value)}
                        renderInput={(params) => (
                          <TextField
                            variant="standard"
                            {...params}
                            helperText={null}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>{testProductSelectedData.wrapUnitMeasure == null ? (
                    testProductSelectedData.unitMeasure
                  ) : (
                    <Select
                      classNamePrefix="select"
                      defaultValue={getOption([{
                        number: 1,
                        name: testProductSelectedData.unitMeasure
                      }, {
                        number: testProductSelectedData.numberOfWrapUnitMeasure,
                        name: testProductSelectedData.wrapUnitMeasure
                      }])[0]}
                      options={getOption([{
                        number: 1,
                        name: testProductSelectedData.unitMeasure
                      }, {
                        number: testProductSelectedData.numberOfWrapUnitMeasure,
                        name: testProductSelectedData.wrapUnitMeasure
                      }])}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    />
                  )}</TableCell>
                  <TableCell><TextField variant="standard" className='text-field-quantity' type={'number'}
                    InputProps={{
                      inputProps: {
                        min: 0
                      }
                    }} /></TableCell>
                  <TableCell><TextField variant="standard" className='text-field-unit-price' /></TableCell>
                  <TableCell>thành tiền nè</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </div>
      <div className='right-container'>
        <Card className='card-container'>
          <div className='label'>
            Thông tin đơn hàng
          </div>
          <div className='time'>{formatDate(new Date().getTime())}</div>
          <div className='label-field'>Vị trí lưu kho</div>
          <Select
            className='selectbox-warehouse'
            classNamePrefix="select"
            placeholder='Chọn kho hàng...'
            isClearable={true}
            isSearchable={true}
            name="warehouse"
            options={getOption(warehouseData)}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
          <div className='label-field'>Tham chiếu</div>
          <div className='margin-bottom-16' >
            <TextField id="referenceNumber" name='referenceNumber' variant="standard" />
          </div>
          <div className='label-field'>Ghi chú</div>
          <TextField id="description"
            className='text-area-note'
            name='description'
            variant="filled"
            maxRows={6}
            multiline />
          <div className='total-amount'>
            <div>Tổng tiền:</div>
            <div>300000VND</div>
          </div>
          <div className='button-import'>
            <Button variant="contained" size="large" startIcon={<CheckIcon />}>
              Nhập hàng
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ImportGoods