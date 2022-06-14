import SelectWrapper from '@/components/FormsUI/Select';
import TextfieldWrapper from '@/components/FormsUI/Textfield';
import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
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
    { value: 'vanilla', label: 'Vanilla' }
  ]
  // const sortTypeList = {
  //   'asc': 'tăng',
  //   'desc': 'giảm',
  // };

  const handleChange = (
    newValue,
    actionMeta
  ) => {
    console.log(newValue);
    setSelectedValue(newValue.value)
    console.log('alo',selectedValue)
    console.log(`action handleChange: ${actionMeta.action}`);
  };
  const handleInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action handleInputChange: ${actionMeta.action}`);
    console.groupEnd();
  };
  return (
    <Box>
      <Formik
        initialValues={{
          category: '1',
          creater: '1',
          productName: 'Thép Việt Á',
          testReactSelect: '',
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
              onChange={(e) => {console.log(e.target.value)}}
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
              value={categorys.filter(({value}) => value === selectedValue)}
              onInputChange={handleInputChange}
              options={categorys}
            />
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default About;
