import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PortfolioChart = ({ trades }) => {
  // Build data from trades (cumulative quantity * price)
  let cumulative = 0;
  const data = trades.map(trade => {
    cumulative += (trade.type === 'BUY' ? 1 : -1) * trade.quantity;
    return {
      time: new Date(trade.createdAt).toLocaleTimeString(),
      value: cumulative * trade.price,
    };
  });

  return (
    <div>
      <h3>Portfolio Value Over Time</h3>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};
