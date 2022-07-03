import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ForgotPassword from './ForgotPassword';
import RequestCodeForm from './RequestCodeForm';
import ConfirmPassword from './ConfirmPassword';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { makeStyles } from '@mui/styles';

function getStepContent(step) {
    switch (step) {
        case 0:
            return <ForgotPassword />;
        case 1:
            return <RequestCodeForm />;
        case 2:
            return <ConfirmPassword />;
        default:
            throw new Error('Unknown step');
    }
}

const useStyles = makeStyles({
    styleLabel: {
        width: '410px',
        marginTop: '24px'
    }
});


export default function CommonForgotPass() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };


    return (
        <Grid
            item
            component="main"
        >
            <Box
                sx={{
                    marginTop: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                }}
            >
                {getStepContent(activeStep)}
                <Box sx={{ display: 'block', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                            mt: 3, ml: 1,
                            width: '410px',
                            padding: "10px 0",
                            left: '-5px',
                            marginTop: '0'
                        }}
                    >
                        Gửi
                    </Button>
                </Box>

                {activeStep === 1 ?
                    <div className={classes.styleLabel}>
                        <div >
                            <label>Bạn không nhận được mail?
                                <Link
                                    href="#"
                                    variant="body2"
                                >
                                    {' bấm vào đây '}
                                </Link>
                                để được gửi lại mã token</label>
                            <br></br>


                        </div>
                        <div style={{ marginTop: '25%' }}>
                            <label>
                                Nếu bạn vẫn chưa xử lý được, hãy liên hệ với quản lý của bạn để được hỗ trợ cài lại mật khẩu. SĐT: 09876543212
                            </label>
                        </div>

                    </div>


                    : ""}
            </Box>
        </Grid>
    );
}