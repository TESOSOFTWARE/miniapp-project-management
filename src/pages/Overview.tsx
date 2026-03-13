import React from 'react';
import { Typography, Row, Col, Card, Empty, Spin, Space } from 'antd';
import { useDashboardData } from '../hooks/useDashboardData';
import KPISection from '../components/KPISection';
import { ProjectSummaryChart } from '../components/Charts';
import FilterBar from '../components/FilterBar';

const { Title } = Typography;

const Overview: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" tip="Fetching data from Google Sheets..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Empty description={error} />
      </Card>
    );
  }

  if (!data || !data.raw) return <Empty description="Please configure your Sheet ID in Settings." />;

  const { raw, filteredWorklog } = data;

  // Prepare chart data based on potentially filtered worklog
  const projectSummaryData = raw.ProjectSummary.map((p: any) => ({
    name: p.ProjectName,
    ProjectId: p.ProjectId,
    Estimate: p.Estimate,
    Actual: (filteredWorklog || [])
      .filter((w: any) => w.ProjectId === p.ProjectId)
      .reduce((acc: number, curr: any) => acc + (curr.Hours || 0), 0)
  }));

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Dashboard Overview</Title>
      
      <FilterBar />

      <KPISection kpis={data.globalKPIs} />

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Project Progress Summary">
            <ProjectSummaryChart title="" data={projectSummaryData} />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Overview;
