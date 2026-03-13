import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { 
  ProjectOutlined, 
  DollarOutlined, 
  FieldTimeOutlined, 
  WalletOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

interface KPIProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  color?: string;
}

const KPICard: React.FC<KPIProps> = ({ title, value, prefix, suffix, color }) => (
  <Card bordered={false} hoverable>
    <Statistic
      title={<Text strong type="secondary">{title}</Text>}
      value={value}
      prefix={prefix}
      suffix={suffix}
      valueStyle={{ color: color || '#2f54eb' }}
    />
  </Card>
);

const { Text } = Typography;

export interface GlobalKPIs {
  totalProjects: number;
  totalEstimate: number;
  totalActualEffort: number;
  totalContractValue: number;
  totalPaidAmount: number;
}

interface KPISectionProps {
  kpis: GlobalKPIs;
}

const KPISection: React.FC<KPISectionProps> = ({ kpis }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={4}>
        <KPICard 
          title="Total Projects" 
          value={kpis.totalProjects} 
          prefix={<ProjectOutlined />} 
        />
      </Col>
      <Col xs={24} sm={12} lg={5}>
        <KPICard 
          title="Total Estimate" 
          value={kpis.totalEstimate} 
          suffix="h"
          prefix={<FieldTimeOutlined />}
          color="#fa8c16"
        />
      </Col>
      <Col xs={24} sm={12} lg={5}>
        <KPICard 
          title="Actual Effort" 
          value={kpis.totalActualEffort} 
          suffix="h"
          prefix={<CheckCircleOutlined />}
          color="#52c41a"
        />
      </Col>
      <Col xs={24} sm={12} lg={5}>
        <KPICard 
          title="Contract Value" 
          value={kpis.totalContractValue} 
          prefix={<DollarOutlined />}
          color="#13c2c2"
        />
      </Col>
      <Col xs={24} sm={12} lg={5}>
        <KPICard 
          title="Total Paid" 
          value={kpis.totalPaidAmount} 
          prefix={<WalletOutlined />}
          color="#eb2f96"
        />
      </Col>
    </Row>
  );
};

export default KPISection;
