import { Card } from '@mui/material';
import React from 'react'
import ImportOrdersTable from '@/pages/Transaction/ImportList/ImportOrdersTable';


const ImportOrders = () => {
  const importOrders = [
    {
      id: "1",
      createDate: new Date().getTime(),
      billRefernce: "1234",
      manufactorName: "Trong",
      statusName: "pending"
    },
    {
      id: "2",
      createDate: new Date().getTime(),
      billRefernce: "1234",
      manufactorName: "Trong",
      statusName: "pending"
    },
    {
      id: "3",
      createDate: new Date().getTime(),
      billRefernce: "1234",
      manufactorName: "Trong",
      statusName: "pending"
    },
  ];
  return (
    <Card>
      <ImportOrdersTable importOrders={importOrders} />
    </Card>
  )
}

export default ImportOrders