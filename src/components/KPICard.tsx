import { Typography, Card } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number | string;
  trendType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendType, icon, iconBgColor, iconColor }) => {
  const getTrendColor = () => {
    if (trendType === 'positive') return '#10b981';
    if (trendType === 'negative') return '#ef4444';
    return '#6b7280';
  };

  return (
    <Card 
      bordered={false} 
      style={{ borderRadius: 12, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ 
          background: iconBgColor, 
          color: iconColor,
          width: 48, 
          height: 48, 
          borderRadius: 12, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: 24
        }}>
          {icon}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: getTrendColor() }}>
          {trendType === 'neutral' ? trend : `${Number(trend) > 0 ? '+' : ''}${trend}%`}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
          {title}
        </Text>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
          {value}
        </Title>
      </div>
    </Card>
  );
};

export default KPICard;
