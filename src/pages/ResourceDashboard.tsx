import React from 'react';
import { Typography, Row, Col, Card, Empty, Spin, Space, Table, Badge } from 'antd';
import { useDashboardData } from '../hooks/useDashboardData';
import FilterBar from '../components/FilterBar';
import { ResourceAllocationChart } from '../components/Charts';


const { Title } = Typography;

const ResourceDashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Loading resources..." /></div>;
  if (error) return <Card><Empty description={error} /></Card>;
  if (!data || !data.raw) return <Empty description="No data available." />;

  const { raw, filteredWorklog } = data;
  const employees = raw.ActiveEmployees || [];
  const plannedEffort = raw.PlannedEffort || [];

  // Comparison Chart Data
  const resourceData = employees.map((emp: any) => {
    const employeeName = emp.Employee || emp.Name;
    const actual = filteredWorklog
      .filter((w: any) => w.Employee === employeeName)
      .reduce((acc: number, curr: any) => acc + (curr.Hours || 0), 0);
    
    const planned = plannedEffort
      .filter((p: any) => p.Employee === employeeName)
      .reduce((acc: number, curr: any) => acc + (curr.PlannedHours || 0), 0);

    return {
      name: employeeName,
      actual,
      planned,
      status: actual > planned ? 'Overload' : 'Underload'
    };
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Resource Management</Title>
      
      <FilterBar />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Planned vs Actual Effort by Employee">
            <ResourceAllocationChart title="" data={resourceData} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Resource Status Details">
            <Table 
              dataSource={resourceData}
              columns={[
                { title: 'Employee', dataIndex: 'name', key: 'name' },
                { title: 'Planned (h)', dataIndex: 'planned', key: 'planned' },
                { title: 'Actual (h)', dataIndex: 'actual', key: 'actual' },
                { 
                  title: 'Utilization', 
                  key: 'utilization',
                  render: (_, record: any) => (
                    <span>
                      {record.planned > 0 ? Math.round((record.actual / record.planned) * 100) : 0}%
                    </span>
                  )
                },
                { 
                  title: 'Status', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status) => (
                    <Badge status={status === 'Overload' ? 'warning' : 'success'} text={status} />
                  )
                }
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default ResourceDashboard;
