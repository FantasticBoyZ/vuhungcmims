import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Textfield from '@/components/Common/FormsUI/Textfield';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Form, Formik, FormikConfig, FormikValues, FormikHelpers } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles({
    styleForm: {
        width: '410px',
        paddingTop: '5%',
        lineHeight: '26px'
    }
});



export default function ForgotPassword() {
    const classes = useStyles();

    const FORM_VALIDATION = Yup.object().shape({
        email: Yup.string()
            .required('Vui lòng không để trống'),
    });


    return (
        <Grid
            item
            component="main"
        >
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                >
                    Quên mật khẩu
                </Typography>

                <Box sx={{ mt: 1 }}>
                    <Formik validationSchema={FORM_VALIDATION}>
                        <Form className={classes.styleForm}>
                            <label htmlFor="email">Bạn quên mật khẩu? vui lòng điền email đã dùng để đăng ký tài khoảng của bạn ở đây.</label>
                            <Textfield
                                name="email"
                                label="Email"
                                margin="normal"
                                fullWidth
                                id="email"
                                autoComplete="email"
                            />
                        </Form>
                    </Formik>

                </Box>
            </Box>
        </Grid>
    );
}