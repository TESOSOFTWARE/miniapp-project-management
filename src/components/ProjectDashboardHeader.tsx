import React from 'react';
import { Typography, Button, Space } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProjectDashboardHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#111827' }}>Project Management</Title>
        <Text type="secondary" style={{ fontSize: 16, color: '#6b7280' }}>
          Monitor project timelines, health, and financial status across departments.
        </Text>
      </div>
      <Space size="middle">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          style={{ 
            background: '#4338ca', 
            borderRadius: 8, 
            height: 40, 
            padding: '0 20px',
            fontWeight: 600
          }}
        >
          New Project
        </Button>
        <Button 
          icon={<ExportOutlined />} 
          style={{ 
            borderRadius: 8, 
            height: 40, 
            padding: '0 20px',
            fontWeight: 600,
            color: '#374151'
          }}
        >
          Export
        </Button>
      </Space>
    </div>
  );
};

export default ProjectDashboardHeader;
