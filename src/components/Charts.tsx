import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ChartProps {
  title: string;
  data: any[];
  height?: number;
}

export const ProjectSummaryChart: React.FC<ChartProps> = ({ title, data }) => {
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: {
      type: 'category',
      data: data.map(item => item.ProjectId || item.name)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Estimate',
        type: 'bar',
        data: data.map(item => item.Estimate),
        itemStyle: { color: '#fa8c16' }
      },
      {
        name: 'Actual',
        type: 'bar',
        data: data.map(item => item.Actual),
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export const BurnDownChart: React.FC<ChartProps> = ({ title, data }) => {
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis', formatter: (params: any) => {
        const p = params[0];
        return `${p.name}<br/>${p.seriesName}: ${Math.round(p.value)}h`;
    }},
    legend: { bottom: 0 },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date)
    },
    yAxis: { type: 'value', name: 'Hours' },
    series: [
      {
        name: 'Ideal Burn',
        type: 'line',
        data: data.map(item => item.ideal),
        lineStyle: { type: 'dashed' },
        itemStyle: { color: '#ccc' }
      },
      {
        name: 'Actual Remaining',
        type: 'line',
        data: data.map(item => item.remaining),
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.1)'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 350 }} />;
};

export const PaymentTrackingChart: React.FC<ChartProps> = ({ title, data }) => {
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: {
      type: 'category',
      data: ['Contract Value', 'Paid Amount', 'Remaining']
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: [
          { value: data[0]?.contract, itemStyle: { color: '#13c2c2' } },
          { value: data[0]?.paid, itemStyle: { color: '#52c41a' } },
          { value: data[0]?.remaining, itemStyle: { color: '#ff4d4f' } }
        ],
        barWidth: '40%'
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export const ResourceAllocationChart: React.FC<ChartProps> = ({ title, data }) => {
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name)
    },
    yAxis: { type: 'value', name: 'Hours' },
    series: [
      {
        name: 'Planned',
        type: 'bar',
        data: data.map(item => item.planned),
        itemStyle: { color: '#91d5ff' }
      },
      {
        name: 'Actual',
        type: 'bar',
        data: data.map(item => item.actual),
        itemStyle: { color: '#36cfc9' }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export const TimelineChart: React.FC<ChartProps> = ({ title, data }) => {
  // Simple representation of activity over time
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'category',
      data: Array.from(new Set(data.map(item => item.Employee))).sort()
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (val: any) => val[2] * 2,
        data: data.map(item => [item.Date, item.Employee, item.Hours]),
        itemStyle: {
            color: '#1890ff'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};
