import React, { useMemo } from 'react';
import { Row, Col, Spin, Empty, Card } from 'antd';
import { 
  RocketOutlined, 
  WalletOutlined, 
  WarningOutlined, 
  TeamOutlined 
} from '@ant-design/icons';
import { useDashboardData } from '../hooks/useDashboardData';
import FilterBar from '../components/FilterBar';
import ProjectDashboardHeader from '../components/ProjectDashboardHeader';
import ProjectListTable from '../components/ProjectListTable';
import KPICard from '../components/KPICard';

const ProjectDashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  const { ProjectSummary } = data?.raw || {};
  const selectedProjectId = data?.filters?.projectId;
  const searchQuery = data?.filters?.searchQuery || '';

  const dataSource = useMemo(() => {
    let source = (ProjectSummary || []).map((item: any, idx: number) => ({ ...item, _originalIndex: idx }));
    
    // Filter by project title search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      source = source.filter((p: any) => 
        (p.ProjectName || p.Project || '').toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedProjectId) {
      source = source.filter((p: any) => p.ProjectId === selectedProjectId);
    }
    return source.map((item: any, idx: number) => ({ ...item, key: item.ProjectId || idx }));
  }, [ProjectSummary, selectedProjectId, searchQuery]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" tip="Loading project data..." />
      </div>
    );
  }

  if (error) return <Card><Empty description={error} /></Card>;
  if (!data || !data.raw) return <Empty description="No data available. Please check settings." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ProjectDashboardHeader />
      
      <FilterBar />

      <ProjectListTable data={dataSource} />

      <Row gutter={[24, 24]} style={{ marginTop: 8 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard 
            title="ACTIVE PROJECTS" 
            value={dataSource.length} 
            trend={12} 
            trendType="positive"
            icon={<RocketOutlined />}
            iconBgColor="#e0e7ff"
            iconColor="#4f46e5"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard 
            title="TOTAL REVENUE" 
            value="$428.5k" 
            trend="On Track" 
            trendType="positive"
            icon={<WalletOutlined />}
            iconBgColor="#d1fae5"
            iconColor="#10b981"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard 
            title="DELAYED TASKS" 
            value="24" 
            trend={-4} 
            trendType="negative"
            icon={<WarningOutlined />}
            iconBgColor="#fee2e2"
            iconColor="#ef4444"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard 
            title="ACTIVE TEAM MEMBERS" 
            value={data.raw.ActiveEmployees?.length || 42} 
            trend="Stable" 
            trendType="neutral"
            icon={<TeamOutlined />}
            iconBgColor="#f3e8ff"
            iconColor="#9333ea"
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProjectDashboard;
