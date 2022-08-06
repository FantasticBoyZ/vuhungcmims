import SelectWrapper from '@/components/Common/FormsUI/Select';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import FormatDataUtils from '@/utils/formatData';
import { CloudUpload, Delete, Search } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { FieldArray, Form, Formik } from 'formik';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { AsyncPaginate } from 'react-select-async-paginate';
import { useDispatch } from 'react-redux';
import { getListProductInStock } from '@/slices/ExportOrderSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { getProductList } from '@/slices/ProductSlice';
const useStyles = makeStyles({
  preview: {
    width: '300px',
    height: '300px',
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
    width: '90%',
    height: '90%',
    position: 'absolute',
    // top: '0',
    // left: '0',
    objectFit: 'cover',
  },
  iconRemoveImg: {
    backgroundColor: '#fff',
    color: '#fff',
    opacity: '0.8',
    position: 'absolute',
    borderRadius: '100px',
    right: '0',
    top: '0',
  },
});

const UserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const classes = useStyles();
  const fetchUserProfiles = () => {
    axios.get('http://localhost:8080/api/v1/user-profile').then((res) => {
      console.log(res);
      setUserProfiles(res.data);
    });
  };
  useEffect(() => {
    fetchUserProfiles();
  }, []);
  return userProfiles.map((userProfile, index) => {
    console.log(
      `http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`,
    );
    return (
      <Box key={index}>
        {userProfile.userProfileId ? (
          <img
            src={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`}
          />
        ) : null}
        <br />
        <br />
        <Dropzone {...userProfile} />
        <Typography variant="h1">{userProfile.userName}</Typography>
        <Typography variant="">{userProfile.userProfileId}</Typography>
      </Box>
    );
  });
};

function Dropzone({ userProfileId }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    axios
      .put(`http://localhost:8080/api/product/update/image/17`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        console.log('file uploaded successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const classes = useStyles();
  const imageProduct = axios.get(
    `http://localhost:8080/api/v1/user-profile/82f2cd6a-2af3-4d18-a6c3-f8efb06160de/image/download`,
  );
  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />

      <label className={classes.preview}>
        <CloudUpload
          fontSize="large"
          className={classes.iconUpload}
        />

        {isDragActive ? <span>Thả ảnh vào đây</span> : <span>Tải ảnh lên</span>}
        {/* {baseImage && (
            <img
              className={classes.imgPreview}
              src={baseImage}
            />
          )} */}
        {/* Đang lỗi xoá ảnh đi */}
        {/* {baseImage && (
            <Box className={classes.iconRemoveImg}>
              <IconButton
                onClick={(e) => {
                  setBaseImage('');
                  return;
                }}
              >
                <CloseRounded />
              </IconButton>
            </Box>
          )} */}
      </label>
    </div>
  );
}

const About = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [baseImage, setBaseImage] = useState('');
  const [currentProduct, setCurrentProduct] = useState('');
  const [errorUpload, setErrorUpload] = useState('');
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const classes = useStyles();
  const dispatch = useDispatch();

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

  const uploadImage = async (e) => {
    console.log('alo');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size / (1024 * 1024) > 5) {
      setErrorUpload('Không thể upload ảnh lớn hơn 5MB');
      console.log('Không thể upload ảnh lớn hơn 5MB');
      return;
    }

    if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
      const base64 = await convertBase64(file);
      console.log(base64);
      setBaseImage(base64);
    } else {
      setErrorUpload('Chỉ chấp nhận định dạng đuôi .jpg, .png');

      return;
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
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

  const addNewProduct = () => {
    const productSelected = {
      productId: '2',
      name: 'Sản phẩm 2',
      productCode: 'SP2',
      unitMeasure: 'Viên',
      wrapUnitMeasure: 'Hộp',
      numberOfWrapUnitMeasure: '10',

      quantity: '',
      unitPrice: '',
      consignments: [
        {
          warehourseId: 2,
          warehourseName: 'Kho 2',
          importDate: '30/06/2022',
          expirationDate: '02/12/2025',
          exportQuantity: '30',
          quantity: '100',
        },
        {
          warehourseId: 3,
          warehourseName: 'Kho 1',
          importDate: '01/06/2022',
          expirationDate: '02/12/2027',
          exportQuantity: '20',
          quantity: '50',
        },
      ],
    };

    arrayHelpersRef.current.push(productSelected);
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
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    try {
      const params = {
        pageIndex: page,
        productName: searchQuery,
        // pageSize: rowsPerPage,
        // ...searchProductParams,
      };
      const actionResult = await dispatch(getProductList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        // setProductList(dataResult.data);
        console.log(page);
        return {
          options: dataResult.data.product,
          hasMore: dataResult.data.product.length >= 1,
          additional: {
            page: searchQuery ? 2 : page + 1,
          },
        };
      }
    } catch (error) {
      console.log('Failed to fetch product list instock: ', error);
    }
  };
  return (
    <Box>
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={categorys}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
      <Autocomplete
        id="free-solo-2-demo"
        options={categorys.map((option) => option.label)}
        noOptionsText="Không tìm thấy Danh mục"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            InputProps={{
              ...params.InputProps,
              
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <AsyncPaginate
        // value={currentProduct}
        loadOptions={loadOptions}
        defaultOptions={true}
        debounceTimeout={300}
        getOptionValue={(option) => option}
        getOptionLabel={(option) => option.name}
        // onChange={(product) => {
        //   setCurrentProduct(product);
        //   console.log(product)
        // }}
        isSearchable={true}
        placeholder="Select House"
        additional={{
          page: 1,
        }}
      />
      <UserProfiles />
      <Box>
        <label
          htmlFor="myPicture"
          className={classes.preview}
        >
          <CloudUpload
            fontSize="large"
            className={classes.iconUpload}
          />
          <span>Tải ảnh lên</span>
          {baseImage && (
            <img
              className={classes.imgPreview}
              src={baseImage}
            />
          )}
          {/* Đang lỗi xoá ảnh đi */}
          {/* {baseImage && (
            <Box className={classes.iconRemoveImg}>
              <IconButton
                onClick={(e) => {
                  setBaseImage('');
                  return;
                }}
              >
                <CloseRounded />
              </IconButton>
            </Box>
          )} */}
        </label>
        <input
          type="file"
          id="myPicture"
          hidden
          name="file_upload"
          onChange={(e) => uploadImage(e)}
        />
      </Box>
      <Formik
        initialValues={{
          category: '1',
          creater: '1',
          productName: 'Thép Việt Á',
          testReactSelect: '',
          consignmentRequests: [
            {
              id: '',
              productCode: 'TEST123',
              name: 'Sản phẩm test',
              expirationDate: '23/03/2022',
              quantity: '10',
              unitMeasure: 'viên',
              unitPrice: '1000',
              consignments: [
                {
                  warehourseId: 1,
                  warehourseName: 'Kho 1',
                  importDate: '20/06/2022',
                  expirationDate: '02/12/2023',
                  exportQuantity: '20',
                  quantity: '80',
                },
              ],
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
            <Button onClick={() => addNewProduct()}>Thêm sản phẩm</Button>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>STT</TableCell>
                    <TableCell>Mã sản phẩm</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Đơn vị</TableCell>
                    <TableCell>Số Lượng</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <FieldArray
                    name="consignmentRequests"
                    render={(arrayHelpers) => {
                      arrayHelpersRef.current = arrayHelpers;
                      valueFormik.current = values;
                      return (
                        <>
                          {values.consignmentRequests.map((item, indexProduct) => (
                            <Fragment key={indexProduct}>
                              <TableRow>
                                <TableCell>
                                  <IconButton
                                    aria-label="delete"
                                    size="large"
                                    onClick={() => {
                                      arrayHelpers.remove(indexProduct);
                                    }}
                                  >
                                    <Delete fontSize="inherit" />
                                  </IconButton>
                                </TableCell>
                                <TableCell>{indexProduct + 1}</TableCell>
                                <TableCell>{item.productCode}</TableCell>
                                <TableCell>{item.name}</TableCell>

                                <TableCell>
                                  {item.wrapUnitMeasure == null ? (
                                    item.unitMeasure
                                  ) : (
                                    <Select
                                      classNamePrefix="select"
                                      defaultValue={
                                        FormatDataUtils.getOption([
                                          {
                                            number: 1,
                                            name: item.unitMeasure,
                                          },
                                          {
                                            number: item.numberOfWrapUnitMeasure,
                                            name: item.wrapUnitMeasure,
                                          },
                                        ])[0]
                                      }
                                      options={FormatDataUtils.getOption([
                                        {
                                          number: 1,
                                          name: item.unitMeasure,
                                        },
                                        {
                                          number: item.numberOfWrapUnitMeasure,
                                          name: item.wrapUnitMeasure,
                                        },
                                      ])}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell>
                                  <TextfieldWrapper
                                    name={`consignmentRequests[${indexProduct}].quantity`}
                                    variant="standard"
                                    className="text-field-quantity"
                                    type={'number'}
                                    InputProps={{
                                      inputProps: {
                                        min: 0,
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextfieldWrapper
                                    name={`consignmentRequests[${indexProduct}].unitPrice`}
                                    variant="standard"
                                    className="text-field-unit-price"
                                    type={'number'}
                                    InputProps={{
                                      inputProps: {
                                        min: 0,
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {FormatDataUtils.formatCurrency(
                                    values.consignmentRequests[indexProduct].quantity *
                                      values.consignmentRequests[indexProduct].unitPrice,
                                  )}
                                </TableCell>
                              </TableRow>
                              {!!values.consignmentRequests[indexProduct]
                                .consignments && (
                                <TableRow>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell colSpan={4}>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Vị trí</TableCell>
                                          <TableCell>Ngày nhập</TableCell>
                                          <TableCell>Hạn lưu kho</TableCell>
                                          <TableCell>Số lượng</TableCell>
                                          <TableCell>Tồn kho</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {values.consignmentRequests[
                                          indexProduct
                                        ].consignments.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.warehourseName}</TableCell>
                                            <TableCell>{item.importDate}</TableCell>
                                            <TableCell>{item.expirationDate}</TableCell>
                                            <TableCell>
                                              <TextfieldWrapper
                                                name={`consignmentRequests[${indexProduct}].consignments[${index}].exportQuantity`}
                                                variant="standard"
                                                className="text-field-unit-price"
                                                type={'number'}
                                                InputProps={{
                                                  inputProps: {
                                                    min: 0,
                                                    max: item.quantity,
                                                  },
                                                }}
                                              />
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              )}
                            </Fragment>
                          ))}
                        </>
                      );
                    }}
                  ></FieldArray>
                </TableBody>
              </Table>
            </TableContainer>
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
