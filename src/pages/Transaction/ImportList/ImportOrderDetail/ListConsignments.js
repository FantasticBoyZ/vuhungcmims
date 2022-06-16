import React from 'react'
import ConsignmentsTable from './ConsignmentsTable';


const ListConsignments = () => {
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
    <ConsignmentsTable importOrders={importOrders} />
  )
}

export default ListConsignments