import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { Info } from '@mui/icons-material';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '30px 20px',
    marginBottom: '20px',
  },
  leftContainer: {
    padding: '20px',
  },
  rightContainer: {
    padding: '20px',
  },
  infoContainer: {
    display: 'flex',
    verticalAlign: 'center',
    justifyContent: 'center',
    padding: '12px',
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    width: '200px',
  },
  textfieldStyle: {
    flex: '5',
  },
  iconStyle: {
    fontSize: 'small',
    margin: '0 10px ',
  },
}));

const AddEditManufacturerForm = () => {
  const { manufacturerId } = useParams();
  const navigate = useNavigate();
  const [manufacturer, setManufacturer] = useState();
  const [isAdd, setIsAdd] = useState(true);
  const classes = useStyles();
  const { initialFormValue, setInitialFormValue } = useState({
    name: '',
    email: '',
    phone: '',
  });
  const initialManufacturerValue = {
    name: '',
    email: '',
    phone: '',
  }
  const phoneRegExp =
    "/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/";

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(200, 'Tên nhà cung cấp không thể dài quá 200 kí tự')
      .required('Chưa nhập tên nhà cung cấp'),
    email: Yup.string().email('Email không hợp lệ').required('Chưa nhập email nhà cung cấp'),

    phone: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Chưa nhập số điện thoại nhà cung cấp'),
  });

  const handleSubmit = (values) => {};

  const handleOnClickExit = () => {
    navigate(isAdd ? '/manufacturer' : `/manufacturer/${manufacturerId}`);
  };

  return (
    // TODO: call api vào làm phần sửa danh mục
    <Container maxWidth="lg">
      <Card className={classes.cardHeader}>
        <Typography variant="h5">Thêm nhà cung cấp</Typography>
      </Card>
      <Card>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid
            xs={12}
            item
          >
            <Formik
              initialValues={{
                ...initialManufacturerValue,
              }}
              validationSchema={FORM_VALIDATION}
              onSubmit={(values) => handleSubmit(values)}
            >
              <Form>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                >
                  <Grid
                    xs={12}
                    item
                    // className={classes.leftContainer}
                  >
                    <Box className={classes.infoContainer}>
                      <Typography className={classes.wrapIcon}>
                        Tên nhà cung cấp <Info className={classes.iconStyle} />
                      </Typography>
                      <TextfieldWrapper
                        name="name"
                        fullWidth
                        id="name"
                        autoComplete="name"
                        autoFocus
                      />
                    </Box>
                    <Box className={classes.infoContainer}>
                      <Typography className={classes.wrapIcon}>
                        Email <Info className={classes.iconStyle} />
                      </Typography>
                      <TextfieldWrapper
                        name="email"
                        fullWidth
                        id="email"
                        autoComplete="email"
                        // autoFocus
                      />
                    </Box>
                    <Box className={classes.infoContainer}>
                      <Typography className={classes.wrapIcon}>
                        Số điện thoại <Info className={classes.iconStyle} />
                      </Typography>
                      <TextfieldWrapper
                        name="phone"
                        fullWidth
                        id="phone"
                        autoComplete="phone"
                        // autoFocus
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  padding="20px"
                >
                  <ButtonWrapper variant="contained">Lưu</ButtonWrapper>
                  <Button
                    onClick={() => handleOnClickExit()}
                    variant="outlined"
                  >
                    Thoát
                  </Button>
                </Stack>
              </Form>
            </Formik>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default AddEditManufacturerForm;
