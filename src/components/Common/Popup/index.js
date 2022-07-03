import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react'

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(2)
    },
    dialogTitle: {
        paddingRight: '0px'
    }
}))

const Popup = (props) => {
    const { title, children, openPopup, setOpenPopup } = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
            <DialogTitle className={classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Button
                        sx={{ color: 'red'}}
                        onClick={()=>{setOpenPopup(false)}}>
                        <Close />
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Popup