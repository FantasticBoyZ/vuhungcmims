import { Card, Container, Grid } from '@mui/material';
import { subDays } from 'date-fns';
import SubProductTable from '@/pages/Product/ProductList/ProductDetail/SubProductTable';

const subProductList = [
  {
    createdDate: '07/05/2021',
    expiredDate: '01/10/2023',
    quantity: 297,
    unitPrice: 745,
    warehouseName: 'Atlanticus Holdings Corporation',
    warehourseAddress: '8369 Summerview Pass',
  },
  {
    createdDate: '03/06/2022',
    expiredDate: '22/03/2023',
    quantity: 208,
    unitPrice: 241,
    warehouseName: 'The Finish Line, Inc.',
    warehourseAddress: '9816 Mosinee Place',
  },
  {
    createdDate: '14/02/2022',
    expiredDate: '19/08/2022',
    quantity: 133,
    unitPrice: 208,
    warehouseName: 'Planet Payment, Inc.',
    warehourseAddress: '842 Hanson Center',
  },
  {
    createdDate: '13/05/2022',
    expiredDate: '01/09/2023',
    quantity: 115,
    unitPrice: 311,
    warehouseName: 'AirMedia Group Inc',
    warehourseAddress: '96819 Kedzie Road',
  },
  {
    createdDate: '11/10/2021',
    expiredDate: '20/07/2022',
    quantity: 128,
    unitPrice: 803,
    warehouseName: 'Rio Tinto Plc',
    warehourseAddress: '01 Hovde Drive',
  },
  {
    createdDate: '10/07/2021',
    expiredDate: '13/07/2023',
    quantity: 253,
    unitPrice: 825,
    warehouseName: 'Tupperware Brands Corporation',
    warehourseAddress: '0090 Forest Point',
  },
  {
    createdDate: '29/10/2021',
    expiredDate: '19/06/2022',
    quantity: 101,
    unitPrice: 146,
    warehouseName: 'Itron, Inc.',
    warehourseAddress: '608 Mallard Drive',
  },
  {
    createdDate: '04/12/2021',
    expiredDate: '17/05/2023',
    quantity: 165,
    unitPrice: 474,
    warehouseName: 'Marrone Bio Innovations, Inc.',
    warehourseAddress: '1916 Hagan Pass',
  },
  {
    createdDate: '27/02/2022',
    expiredDate: '07/09/2022',
    quantity: 146,
    unitPrice: 397,
    warehouseName: 'State Auto Financial Corporation',
    warehourseAddress: '39004 Crescent Oaks Junction',
  },
  {
    createdDate: '04/10/2021',
    expiredDate: '15/12/2023',
    quantity: 284,
    unitPrice: 357,
    warehouseName: 'Granite Construction Incorporated',
    warehourseAddress: '70770 Towne Drive',
  },
  {
    createdDate: '03/04/2021',
    expiredDate: '06/01/2023',
    quantity: 260,
    unitPrice: 504,
    warehouseName: 'Lakeland Industries, Inc.',
    warehourseAddress: '02 Walton Terrace',
  },
  {
    createdDate: '09/06/2022',
    expiredDate: '09/07/2023',
    quantity: 205,
    unitPrice: 543,
    warehouseName: 'Quanex Building Products Corporation',
    warehourseAddress: '4 Doe Crossing Point',
  },
  {
    createdDate: '23/05/2021',
    expiredDate: '08/11/2022',
    quantity: 150,
    unitPrice: 856,
    warehouseName: 'Discover Financial Services',
    warehourseAddress: '24 Granby Road',
  },
  {
    createdDate: '11/08/2021',
    expiredDate: '18/07/2023',
    quantity: 122,
    unitPrice: 497,
    warehouseName: 'Gener8 Maritime, Inc.',
    warehourseAddress: '4521 David Parkway',
  },
  {
    createdDate: '15/09/2021',
    expiredDate: '09/07/2023',
    quantity: 203,
    unitPrice: 773,
    warehouseName: 'United Insurance Holdings Corp.',
    warehourseAddress: '937 Novick Trail',
  },
  {
    createdDate: '17/10/2021',
    expiredDate: '13/09/2023',
    quantity: 181,
    unitPrice: 694,
    warehouseName: 'Diamond Hill Investment Group, Inc.',
    warehourseAddress: '851 Granby Junction',
  },
  {
    createdDate: '07/08/2021',
    expiredDate: '18/02/2023',
    quantity: 135,
    unitPrice: 199,
    warehouseName: 'Kimco Realty Corporation',
    warehourseAddress: '79691 Vermont Parkway',
  },
  {
    createdDate: '03/06/2022',
    expiredDate: '11/01/2023',
    quantity: 224,
    unitPrice: 603,
    warehouseName: 'YRC Worldwide, Inc.',
    warehourseAddress: '0732 North Pass',
  },
  {
    createdDate: '16/04/2021',
    expiredDate: '28/07/2022',
    quantity: 176,
    unitPrice: 340,
    warehouseName: 'Global Net Lease, Inc.',
    warehourseAddress: '4698 Grover Pass',
  },
  {
    createdDate: '06/06/2021',
    expiredDate: '21/12/2022',
    quantity: 102,
    unitPrice: 595,
    warehouseName: 'Entegris, Inc.',
    warehourseAddress: '935 Lakewood Gardens Place',
  },
];

const SubProductList = () => {
  return (
    <Card>
      <SubProductTable subProductList={subProductList} />
    </Card>
  );
};

export default SubProductList;
