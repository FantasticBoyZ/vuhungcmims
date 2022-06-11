import SelectWrapper from '@/components/FormsUI/Select';
import { Box } from '@mui/material';
import { Form, Formik } from 'formik';

const About = () => {
  const categoryList = {
    '1': 'Gạch',
    '2': 'Sơn',
    '3': 'Xi măng',
  };
  
  // const manufacturerList = {
  //   '1': 'Hoàng Phát',
  //   '2': 'Surplus',
  //   '3': 'Toyota',
  // };
  
  // const sortTypeList = {
  //   'asc': 'tăng',
  //   'desc': 'giảm',
  // };
  return (
    <Box>
      <Formik
      initialValues={{
        category: '1',
      }}
      // validationSchema={FORM_VALIDATION}
      // onSubmit={handleLogin}
      > 
      {({ values }) => (
        <Form>
          
            <SelectWrapper
              label="Nhóm hàng"
              name="category"
              options={categoryList}
            />
            
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </Form>
       )} 
        
      </Formik>
    </Box>
  );
};

export default About;
