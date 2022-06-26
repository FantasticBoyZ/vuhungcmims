import DateTimePicker from '@/components/Common/FormsUI/DateTimePicker';
import SelectWrapper from '@/components/Common/FormsUI/Select';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { FieldArray, Form, Formik } from 'formik';
import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const About = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const categoryList = {
    1: 'Gạch',
    2: 'Sơn',
    3: 'Xi măng',
  };

  const createrList = {
    1: 'Hoàng Phát',
    2: 'Surplus',
    3: 'Toyota',
  };
  const categorys = [
    { value: 1, label: 'Epoxy Flooring' },
    { value: 2, label: 'Electrical and Fire Alarm' },
    { value: 3, label: 'Fire Protection' },
    { value: 4, label: 'Prefabricated Aluminum Metal Canopies' },
    { value: 5, label: 'Masonry' },
  ];

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  // const sortTypeList = {
  //   'asc': 'tăng',
  //   'desc': 'giảm',
  // };
  let formData = new FormData();

  const onFileChange = (e) => {
    console.log('file', e.target.files[0]);
    if (e.target && e.target.files[0]) {
      formData.append('file', e.target.files[0]);
    }
  };

  const submitFileData = () => {
    axios
      .post('https://v2.convertapi.com/upload', { formData })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (newValue, actionMeta) => {
    console.log(newValue);
    setSelectedValue(newValue.value);
    console.log('alo', selectedValue);
    console.log(`action handleChange: ${actionMeta.action}`);
  };
  const handleInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action handleInputChange: ${actionMeta.action}`);
    console.groupEnd();
  };

  const [age, setAge] = useState('');

  const handleAgeChange = (event) => {
    console.log(event.target.value);
    setAge(event.target.value);
  };
  return (
    <Box>
      <Formik
        initialValues={{
          category: '1',
          creater: '1',
          productName: 'Thép Việt Á',
          testReactSelect: '',
          productArray: [
            {
              id: '',
              productCode: '',
              name: '',
              expiredDate: '',
              quantity: '',
              price: '',
            },
          ],
        }}
        // validationSchema={FORM_VALIDATION}
        // onSubmit={handleLogin}
      >
        {({ values }) => (
          <Form>
            <TextfieldWrapper
              name="productName"
              disabled
            />
            <SelectWrapper
              label="Nhóm hàng"
              name="category"
              options={categoryList}
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
            <SelectWrapper
              label="người tạo"
              name="creater"
              options={createrList}
            />
            <Typography>Danh mục</Typography>
            <CreatableSelect
              isClearable
              onChange={(value, actionMeta) => handleChange(value, actionMeta)}
              value={categorys.filter(({ value }) => value === selectedValue)}
              onInputChange={handleInputChange}
              options={categorys}
            />
            <TextField
              type="file"
              name="file_upload"
              onChange={onFileChange}
            />
            <FieldArray name="productArray">
              {({ push, remove }) => (
                <>
                  <Grid item>All your Products:</Grid>
                  {values.productArray.map((_, index) => (
                    <Grid
                      container
                      item
                    >
                      <Grid item>
                        <TextfieldWrapper label="Mã sản phẩm" name={`productArray[${index}].productCode`} />
                      </Grid>
                      <Grid item>
                        <TextfieldWrapper label="Tên sản phẩm" name={`productArray[${index}].name`} />
                      </Grid>
                      <Grid item>
                        <DateTimePicker label="Ngày hết hạn" name={`productArray[${index}].expiredDate`} />
                      </Grid>
                      <Grid item>
                        <TextfieldWrapper label="Số lượng" type="number" name={`productArray[${index}].quantity`} />
                      </Grid>
                      <Grid item>
                        <Button onClick={() => remove(index)}>Delete</Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item>
                    <Button onClick={() => push({productCode:'', name: '', expiredDate: '', quantity: ''})}>Add Product</Button>
                  </Grid>
                </>
              )}
            </FieldArray>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
      <Button onClick={submitFileData}>Submit File</Button>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleAgeChange}
        >
          {categorys.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default About;
