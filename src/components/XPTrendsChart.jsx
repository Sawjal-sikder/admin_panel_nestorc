import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const XPTrendsChart = () => {
  // Demo data that matches the screenshot structure
  const data = [
    { name: "Aug", xp: 22 },
    { name: "Sep", xp: 20 },
    { name: "Oct", xp: 18 },
    { name: "Nov", xp: 33 },
    { name: "Dec", xp: 28 },
    { name: "Jan", xp: 24 },
    { name: "Fev", xp: 25 },
    { name: "Mar", xp: 30 },
    { name: "Apr", xp: 20 },
    { name: "May", xp: 25 },
    { name: "Jun", xp: 20 },
    { name: "Jul", xp: 30 },
  ];

  
  const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#cb5d00', border: '1px solid #ccc', padding: '5px' }}>
        <p><strong>{label}</strong></p>
        <p>{`XP: ${payload[0].payload.xp}`}</p>
      </div>
    );
  }

  return null;
};

  return (
    <div className="h-[470px] rounded-lg border-[1px] border-[#7ED321]">
      <h2 className="text-[24px] font-semibold pl-[40px] my-7">Script generated</h2>
      <div className="h-[380px] mt-5 mr-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#F3F3F3" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#F3F3F3" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="xp"
              fill="#FE7400"
              radius={[4, 4, 0, 0]}
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default XPTrendsChart;
