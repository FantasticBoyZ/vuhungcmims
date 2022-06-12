import { Card } from '@mui/material';
import React from 'react'
import ImportOrdersTable from '@/pages/Transaction/ImportList/ImportOrdersTable';


const ImportOrders = () => {
    const importOrders = [
        {
          id: '1',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'completed',
          orderID: 'VUVX709ET7BY',
          sourceName: 'Bank Account',
          sourceDesc: '*** 1111',
          amountCrypto: 34.4565,
          amount: 56787,
          cryptoCurrency: 'ETH',
          currency: '$'
        },
        {
          id: '2',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'completed',
          orderID: '23M3UOG65G8K',
          sourceName: 'Bank Account',
          sourceDesc: '*** 1111',
          amountCrypto: 6.58454334,
          amount: 8734587,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '3',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'failed',
          orderID: 'F6JHK65MS818',
          sourceName: 'Bank Account',
          sourceDesc: '*** 1111',
          amountCrypto: 6.58454334,
          amount: 8734587,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '4',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'completed',
          orderID: 'QJFAI7N84LGM',
          sourceName: 'Bank Account',
          sourceDesc: '*** 1111',
          amountCrypto: 6.58454334,
          amount: 8734587,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '5',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'pending',
          orderID: 'BO5KFSYGC0YW',
          sourceName: 'Bank Account',
          sourceDesc: '*** 1111',
          amountCrypto: 6.58454334,
          amount: 8734587,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '6',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'completed',
          orderID: '6RS606CBMKVQ',
          sourceName: 'Bank Account',
          sourceDesc: '*** 1111',
          amountCrypto: 6.58454334,
          amount: 8734587,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '7',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'pending',
          orderID: '479KUYHOBMJS',
          sourceName: 'Bank Account',
          sourceDesc: '*** 1212',
          amountCrypto: 2.346546,
          amount: 234234,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '8',
          orderDetails: 'Paypal Withdraw',
          orderDate: new Date().getTime(),
          status: 'completed',
          orderID: 'W67CFZNT71KR',
          sourceName: 'Paypal Account',
          sourceDesc: '*** 1111',
          amountCrypto: 3.345456,
          amount: 34544,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '9',
          orderDetails: 'Fiat Deposit',
          orderDate: new Date().getTime(),
          status: 'completed',
          orderID: '63GJ5DJFKS4H',
          sourceName: 'Bank Account',
          sourceDesc: '*** 2222',
          amountCrypto: 1.4389567945,
          amount: 123843,
          cryptoCurrency: 'BTC',
          currency: '$'
        },
        {
          id: '10',
          orderDetails: 'Wallet Transfer',
          orderDate: new Date().getTime(),
          status: 'failed',
          orderID: '17KRZHY8T05M',
          sourceName: 'Wallet Transfer',
          sourceDesc: "John's Cardano Wallet",
          amountCrypto: 765.5695,
          amount: 7567,
          cryptoCurrency: 'ADA',
          currency: '$'
        }
      ];
  return (
    <Card>
      <ImportOrdersTable importOrders={importOrders} />
    </Card>
  )
}

export default ImportOrders