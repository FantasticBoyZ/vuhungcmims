import ImportOrdersTable from '@/pages/Transaction/ImportList/ImportOrdersTable';
import { Box } from '@mui/material';


const ImportOrders = ({importOrders}) => {
  // const importOrders = [
  //   {
  //     id: "1",
  //     createDate: new Date().getTime(),
  //     billRefernce: "1234",
  //     manufactorName: "Trong",
  //     statusName: "pending"
  //   },
  //   {
  //     id: "2",
  //     createDate: new Date().getTime(),
  //     billRefernce: "1234",
  //     manufactorName: "Trong",
  //     statusName: "pending"
  //   },
  //   {
  //     id: "3",
  //     createDate: new Date().getTime(),
  //     billRefernce: "1234",
  //     manufactorName: "Trong",
  //     statusName: "pending"
  //   },
  // ];
  // console.log(importOrders)
  return (
    <Box>
      <ImportOrdersTable importOrders={importOrders} />
    </Box>
  )
}

export default ImportOrders