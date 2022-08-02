import { Box } from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    name: '7-2022',
    totalAmount: 24,
    // amt: 2400,
  },
  {
    name: '8-2022',
    totalAmount: 13.98,
    // amt: 2210,
  },
  {
    name: '8-2022',
    totalAmount: 98,
    // amt: 2290,
  },
  {
    name: '9-2022',
    totalAmount: 39,
    // amt: 2000,
  },
  {
    name: '10-2022',
    totalAmount: 48,
    // amt: 2181,
  },
  {
    name: '11-2022',
    totalAmount: 38,
    // amt: 2500,
  },
  {
    name: '12-2022',
    totalAmount: 43,
    // amt: 2100,
  },
];


const InventoryChart = () => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p >{`${label} : ${payload[0].value} triệu`}</p>
          {/* <p className="intro">{getIntroOfPage(label)}</p>
          <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }
  
    return null;
  };

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id="colorTotalAmount"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="#109CF1"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="#109CF1"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="name"></XAxis>
        <YAxis >
          {/* <Label
            value="Triệu"
            offset={0}
            position="top"
          /> */}
        </YAxis>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip/>}/>
        {/* <Legend
          height={36}
        /> */}
        <Area
          type="monotone"
          dataKey="totalAmount"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorTotalAmount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default InventoryChart;
