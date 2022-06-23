import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Input,
  Typography,
  TextField,
} from '@mui/material';
import TextfieldWrapper from '@/components/FormsUI/Textfield';
import { Form, Formik } from 'formik';

const useStyles = makeStyles({
  staffInformation: {
    marginBottom: '32px',
  },
  cardStyle: {
    padding: '12px',
  },
  styleContainer: {
    fontWeight: '400',
    fontSize: '20px',
  },
  inputField: {
    width: '30%',
  }, styleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px'
  }
});

const StaffDetail = ({ staff }) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const { initialFormValue, setInitialFormValue } = useState({
    // name: category?.name || '',
    username: '',
    role: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleOnClickEdit = () => {
    navigate(`/staff/edit/${staff.id}`);
  };
  return (
    <Box className={classes.staffInformation}>
      <Card className={classes.cardStyle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          p={2}
        >
          <Typography variant="h3"></Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              //   onClick={() => handleOnClickEdit()}
              variant="contained"
            >
              Sửa
            </Button>
            <Button variant="outlined">Thoát</Button>
          </Stack>
        </Stack>
        <Divider />
        <Grid container>
          <Grid
            item
            xs={4}
          >
            <CardMedia
              component="img"
              height="200"
              sx={{ width: 200, margin: "15%" }}
              alt="staff Detail"
              src="https://www.w3schools.com/w3images/avatar2.png"
            />
          </Grid>
          <Grid
            container
            item
            xs={8}
          >
            <Grid
              xs={12}
              item
            >
              <Formik
                initialValues={{

                }}
              >
                <Form>
                  <Box className={classes.styleBox}>
                    <Typography
                      className={classes.inputField}
                      fontSize="18px"
                      lineHeight={2}
                    >
                      Tên nhân viên:{'  '}
                    </Typography>
                    <TextfieldWrapper
                      defaultValue={'ABC'}
                      name="username"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  <Box className={classes.styleBox}>
                    <Typography
                      className={classes.inputField}
                      fontSize="18px"
                      lineHeight={2}
                    >
                      Vị trí làm việc:{' '}
                    </Typography>

                    <TextfieldWrapper
                      name="role"
                      defaultValue={'Seller'}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  <Box className={classes.styleBox}>
                    <Typography
                      className={classes.inputField}
                      fontSize="18px"
                      lineHeight={2}
                    >
                      Số điện thoại:{' '}
                    </Typography>

                    <TextfieldWrapper
                      name="phone"
                      defaultValue={'0123456789'}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  <Box className={classes.styleBox}>
                    <Typography
                      className={classes.inputField}
                      fontSize="18px"
                      lineHeight={2}
                    >
                      Email:{' '}
                    </Typography>

                    <TextfieldWrapper
                      name="email"
                      defaultValue={'abc@gmail.com'}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  <Box className={classes.styleBox}>
                    <Typography
                      className={classes.inputField}
                      fontSize="18px"
                      lineHeight={2}
                    >
                      Địa chỉ:{' '}
                    </Typography>

                    <TextfieldWrapper
                      name="address"
                      defaultValue={'Thạch Thất - HN'}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                </Form>
              </Formik>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default StaffDetail;
