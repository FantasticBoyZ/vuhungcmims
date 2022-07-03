import FormatDataUtils from '@/utils/formatData';
import { Add, Close, Edit, KeyboardReturn } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent, Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExportProductTable from './ExportProductTable';

const useStyles = makeStyles((theme) => ({
  billReferenceContainer: {
    fontSize: '24px',
  },
  buttonAction: {},
  cardTable: {
    padding: theme.spacing(2),
    minHeight: '80vh'
  },
  confirmInfo: {},
  warehourseInfo: {},
  orderNote: {
    minHeight: '20vh'
  },
  totalAmount: {

  }
}));
const ExportOrderDetail = () => {
  const classes = useStyles();
  const exportOrder = {
    billReferenceNumber: 'ABC1234',
    statusName: 'pending',
    creatorId: '1',
    creatorName: 'Obama',
    createdDate: new Date(),
    validator: 'Biden',
    confirmedDate: new Date(),
    warehourseId: '1',
    warehourseName: 'Kho 1',
    addressDetail: 'So 32 To 4',
    provinceId: 1,
    districtId: 1,
    wardId: 1,
    provinceName: 'Ha Noi',
    districtName: 'Chuong My',
    wardName: 'Xuan Mai',
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    productList : [
      {
        id: 1,
        productCode: 'GACH23',
        productName: 'Gạch men 60x60',
        unitMeasure: 'Viên',
        quantity: '700',
        unitPrice: 100000,
        consignments: [
          {
            id: 1,
            warehouseId: 1,
            warehourseName: 'Kho 1',
            importDate: '16/07/2022',
            expirationDate: '30/12/2022',
            quantity: '200',
          },
          {
            id: 2,
            warehouseId: 1,
            warehourseName: 'Kho 1',
            importDate: '20/07/2022',
            expirationDate: '30/12/2022',
            quantity: '500',
          },
        ],
      },
      {
        id: 2,
        productCode: 'GACH34',
        productName: 'Gạch men 60x60',
        unitMeasure: 'Viên',
        quantity: '1000',
        unitPrice: 100000,
        consignments: [
          {
            id: 1,
            warehouseId: 1,
            warehourseName: 'Kho 1',
            importDate: '16/07/2022',
            expirationDate: '30/12/2022',
            quantity: '200',
          },
          {
            id: 2,
            warehouseId: 1,
            warehourseName: 'Kho 1',
            importDate: '20/07/2022',
            expirationDate: '30/12/2022',
            quantity: '800',
          },
        ],
      },
    ]
  }
  
  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const productList = exportOrder?.productList
    for (let index = 0; index < productList.length; index++) {
      totalAmount = totalAmount + (+productList[index]?.quantity)*(+productList[index]?.unitPrice)
    }
    return totalAmount;
  }
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
            <Box className={classes.billReferenceContainer}>
              <Typography variant="span">
                <strong>Phiếu xuất kho số:</strong> {exportOrder.billReferenceNumber}
              </Typography>{' '}
              <span>{FormatDataUtils.getStatusLabel(exportOrder.statusName)}</span>
            </Box>
            {
              exportOrder.statusName === 'pending' && <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              className={classes.buttonAction}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                color="success"
              >
                Xác nhận xuất kho
              </Button>
              <Button
                variant="contained"
                startIcon={<Edit />}
                color="warning"
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="contained"
                startIcon={<Close />}
                color="error"
              >
                Huỷ phiếu xuất kho
              </Button>
            </Stack>
            }
            {
              exportOrder.statusName === 'completed' && <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              className={classes.buttonAction}
            >
              <Button
                variant="contained"
                startIcon={<KeyboardReturn />}
                color="warning"
              >
                Trả hàng
              </Button>
            </Stack>
            }
          </Stack>
        </Card>
      </Grid>
      <Grid
        xs={9}
        item
      >
        <Grid
          container
          spacing={2}
        >
          {/* <Grid
            xs={12}
            item
          >
            <Card>Thông tin phiếu xuất kho</Card>
          </Grid> */}
          <Grid
            xs={12}
            item
          >
            <Card className={classes.cardTable}>
              <ExportProductTable productList={exportOrder?.productList} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        xs={3}
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
            <Card>
              <CardContent className={classes.confirmInfo}>
                <Typography variant="h6">Thông tin xác nhận</Typography>
                <Typography>
                  Người tạo đơn: <i>{exportOrder.creatorName}</i>
                </Typography>
                <Typography>Ngày tạo đơn:</Typography>
                <Typography>{FormatDataUtils.formatDateTime(exportOrder.createdDate)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={12}
            item
          >
            <Card>
              <CardContent className={classes.warehourseInfo}>
                <Typography variant="h6">Kho lấy hàng</Typography>
                <Typography>{exportOrder.warehourseName}</Typography>
                <Divider />
                <Typography>{exportOrder.addressDetail}</Typography>
                <Typography>{exportOrder.wardName} - {exportOrder.districtName} - {exportOrder.provinceName}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={12}
            item
          >
            <Card>
              {/* <CardHeader
                  titleTypographyProps={{ variant: 'h6' }}
                  title="Tổng giá trị đơn hàng"
                /> */}
              <CardContent className={classes.orderNote}>
                <Typography variant="h6">Ghi chú</Typography>
                <Typography>
                  {exportOrder.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={12}
            item
          >
            <Card>
              <CardContent className={classes.totalAmount}>
                {/* <CardHeader
                  titleTypographyProps={{ variant: 'h6' }}
                  title="Tổng giá trị đơn hàng"
                /> */}
                <Typography variant="h6">Tổng giá trị đơn hàng</Typography>
                <br/>
                <Typography align="right">
                  {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExportOrderDetail;
