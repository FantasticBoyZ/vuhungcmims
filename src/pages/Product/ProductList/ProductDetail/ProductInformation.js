import { API_URL_IMAGE } from '@/constants/apiUrl';
import FormatDataUtils from '@/utils/formatData';
import { Edit } from '@mui/icons-material';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  productInformation: {
    marginBottom: '32px',
  },
  cardStyle: {
    padding: '12px',
  },
  infoStyle: {
    fontSize: '16px',
  },
  labelInfo: {
    color: '#696969',
  },
  contentInfo: {
    color: '#000000',
    fontWeight: '400 !important',
  },
  descriptionField: {
    color: '#000000',
    fontWeight: '400 !important',
    wordBreak: 'break-word',
  },
  imageStyle: {
    height: '250px',
    objectFit: 'cover',
    borderRadius: '15px',
    border: '1px solid black',
    aspectRatio: '1/1',
  },
});

const localhost = 'http://localhost:8080';
const deployUrl = 'http://ec2-52-221-240-240.ap-southeast-1.compute.amazonaws.com:8080';

const ProductInformation = ({ product, selectedUnitMeasure }) => {
  const classes = useStyles();
  const [image, setImage] = useState();
  const navigate = useNavigate();

  const getImageProduct = async () => {
    return await axios.get(localhost + '/' + product.image);
  };
  const handleOnClickEdit = () => {
    navigate(`/product/edit/${product.id}`);
  };

  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL);
  };

  useEffect(() => {
    if (product.image) {
      fetchImage(API_URL_IMAGE + '/' + product.image);
    }
  }, []);

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        xs={12}
        item
      >
        <Card>
          <Stack
            direction="row"
            justifyContent="space-between"
            p={2}
          >
            <Typography variant="h6">
              <strong>{product.name}</strong>
            </Typography>

            <Button
              variant="contained"
              startIcon={<Edit />}
              color="warning"
              onClick={() => handleOnClickEdit()}
            >
              Ch???nh s???a
            </Button>
          </Stack>
        </Card>
      </Grid>
      <Grid
        xs={12}
        item
      >
        <Card>
          {/* <CardHeader title="Th??ng tin s???n ph???m" /> */}
          <CardContent>
            <Typography variant="h6">Th??ng tin s???n ph???m</Typography>

            <CardContent className={classes.infoStyle}>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  xs={4}
                  item
                >
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>
                            M?? s???n ph???m
                          </Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.productCode}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>
                            Nh?? s???n xu???t
                          </Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.manufactorName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>Danh m???c</Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.categoryName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>
                            Danh m???c ph???
                          </Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.subCategoryName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>M??u s???c</Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.color}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>????n gi??</Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {FormatDataUtils.formatCurrency(
                              selectedUnitMeasure === product.unitMeasure
                                ? product.unitPrice
                                : product.unitPrice * product.numberOfWrapUnitMeasure ||
                                    0,
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  xs={4}
                  item
                >
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      xs={12}
                      item
                    >
                      <Typography className={classes.labelInfo}>
                        M?? t??? s???n ph???m
                      </Typography>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Typography className={classes.descriptionField}>
                        {product.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  xs={4}
                  item
                >
                  <Stack alignItems="center">
                    <img
                      // component="img"
                      // height="250"
                      // sx={{ width: 250 }}
                      className={classes.imageStyle}
                      alt="???nh s???n ph???m"
                      // src={image}
                      loading="lazy"
                      src={image ? image : require('@/assets/images/no-image-found.png')}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductInformation;
