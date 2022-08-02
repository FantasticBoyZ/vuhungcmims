import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import IconRequired from '@/components/Common/IconRequired';
import { Close, Done } from '@mui/icons-material';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Form, Formik } from 'formik';
import React from 'react';

import * as Yup from 'yup';

const useStyles = makeStyles({
  unitMeasureField: {
    width: '30%',
  },
});
const ProductForm = (props) => {
  const classes = useStyles();
  const { handleAddProduct, setOpenPopupAddProduct, errorMessage } = props;
  const initialFormValue = {
    name: '',
    unitMeasure: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(200, 'Tên sản phẩm không thể dài quá 200 kí tự')
      .required('Chưa nhập tên sản phẩm'),
    unitMeasure: Yup.string()
      .max(50, 'Đơn vị không thể dài quá 50 kí tự')
      .required('Chưa nhập đơn vị'),
  });

  const handleSubmit = (values) => {
    const newProduct = {
      name: values.name,
      unitMeasure: values.unitMeasure,
    };
    // TODO: truyền new Product vào table
    handleAddProduct(newProduct);
  };
  return (
    <Formik
      initialValues={{
        ...initialFormValue,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Grid
            container
            spacing={2}
            p={2}
          >
            <Grid
              xs={12}
              item
            >
              <Stack
                direction="row"
                spacing={2}
              >
                <Stack flex={3}>
                  <Typography>
                    Tên sản phẩm
                    <IconRequired />
                  </Typography>
                </Stack>
                <Stack flex={7}>
                  <TextfieldWrapper
                    name="name"
                    fullWidth
                    id="name"
                    autoComplete="name"
                    autoFocus
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              item
            >
              <Stack
                direction="row"
                spacing={2}
              >
                <Stack flex={3}>
                  <Typography>
                    Đơn vị
                    <IconRequired />
                  </Typography>
                </Stack>
                <Stack flex={7}>
                  <TextfieldWrapper
                    name="unitMeasure"
                    className={classes.unitMeasureField}
                    id="unitMeasure"
                    autoComplete="unitMeasure"
                  />
                </Stack>
              </Stack>
            </Grid>
            {errorMessage && (
              <Grid
                xs={12}
                item
              >
                <Typography color='error'>{errorMessage}</Typography>
              </Grid>
            )}
            <Grid
              xs={12}
              item
            >
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
              >
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Done />}
                  type="submit"
                >
                  Thêm sản phẩm
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Close />}
                  onClick={() => setOpenPopupAddProduct(false)}
                >
                  Huỷ
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
