import IconRequired from '@/components/Common/IconRequired';
import WarehouseList from '@/pages/Warehouse/wareHouseList';
import FormatDataUtils from '@/utils/formatData';
import { Close, CloudUpload, Done } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';

const useStyles = makeStyles((theme) => ({
  preview: {
    width: '250px',
    height: '250px',
    border: '2px dashed black',
    borderRadius: '5px',
    display: 'block',
    fontSize: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    position: 'relative',
  },
  iconUpload: {
    fontSize: '50px',
    marginBottom: '20px',
  },
  imgPreview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // top: '0',
    // left: '0',
    objectFit: 'cover',
  },
}));

function Dropzone(props) {
  const { imageUrl, setImageUrl, setFormData } = props;
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // console.log(fileRejections[0]);
    if (!!fileRejections[0]) {
      //   console.log(fileRejections[0].errors);
      if (fileRejections[0].errors[0].code === 'file-invalid-type') {
        console.log('Bạn vui lòng chọn file đuôi .jpg, .png để tải lên');
        return;
      }
      if (fileRejections[0].errors[0].code === 'file-too-large') {
        console.log('Bạn vui lòng chọn file ảnh dưới 5MB để tải lên');
      }
    } else {
      // Do something with the files
      const file = acceptedFiles[0];
      console.log(file);

      setImageUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('file', file);
      // console.log('inside',...formData)
      setFormData(formData);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });
  const classes = useStyles();

  return (
    <div
      {...getRootProps()}
      className={classes.preview}
    >
      <input {...getInputProps()} />
      {imageUrl && (
        <img
          className={classes.imgPreview}
          src={imageUrl}
        />
      )}
      <CloudUpload
        fontSize="large"
        className={classes.iconUpload}
      />

      {isDragActive ? <span>Thả ảnh vào đây</span> : <span>Tải ảnh lên</span>}
    </div>
  );
}

const roleList = [
  {
    id: 1,
    name: 'Nhân viên bán hàng',
  },
  {
    id: 2,
    name: 'Thủ kho',
  },
];

const AddStaff = () => {
  const [imageUrl, setImageUrl] = useState();
  const [formData, setFormData] = useState(new FormData());
  const [gender, setGender] = useState(1);
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        xs={2.5}
        item
      >
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ảnh đại diện</Typography>
              <Stack
                direction="row"
                padding={1}
                justifyContent="center"
              >
                <Dropzone
                  // {...userProfile}
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  setFormData={setFormData}
                />
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Chức vụ
                <IconRequired />
              </Typography>
              <Select
                classNamePrefix="select"
                defaultValue={roleList[0]}
                options={roleList}
                getOptionValue={(option) => option}
                getOptionLabel={(option) => option.name}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </CardContent>
          </Card>
        </Stack>
      </Grid>
      <Grid
        xs={9.5}
        item
      >
        <Card>
          <CardContent>
            <Typography variant="h6">Thông tin cá nhân</Typography>
            <Stack padding={2}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={6}
                  item
                >
                  <Typography>
                    Mã nhân viên
                    <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={6}
                  item
                >
                  <Typography>
                    Họ và tên
                    <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={6}
                  item
                >
                  <Typography>
                    Số CCCD/CMND <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={6}
                  item
                >
                  <Typography>
                    Ngày sinh
                    <IconRequired />
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="birthDate"
                      label={null}
                      // value={startDate}
                      inputFormat="dd/MM/yyyy"
                      onChange={(newValue) => {
                        console.log(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid
                  xs={12}
                  item
                >
                  <Typography>Giới tính</Typography>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Nữ"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid
                  xs={6}
                  item
                >
                  <Typography>
                    Số điện thoại
                    <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={6}
                  item
                >
                  <Typography>
                    Email
                    <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={4}
                  item
                >
                  <Typography>
                    Tỉnh/Thành phố
                    <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={4}
                  item
                >
                  <Typography>
                    Quận/Huyện/Thành phố
                    <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={4}
                  item
                >
                  <Typography>
                    Phường/Xã <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
                <Grid
                  xs={12}
                  item
                >
                  <Typography>
                    Địa chỉ chi tiết
                    <IconRequired />
                  </Typography>
                  <TextField fullWidth />
                </Grid>
              </Grid>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              p={2}
            >
              <Button
                variant="contained"
                startIcon={<Done />}
                color="success"
              >
                Thêm nhân viên
              </Button>
              <Button
                variant="contained"
                startIcon={<Close />}
                color="error"
              >
                Huỷ
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AddStaff;
