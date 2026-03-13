import React, { useMemo } from 'react';
import { Row, Col, Card, Avatar, Typography, Tag, Space, Empty, Spin } from 'antd';
import { 
  GithubOutlined, 
  SendOutlined, 
  TeamOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useDashboardData } from '../hooks/useDashboardData';

const { Title, Text } = Typography;

const Team: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  const teamMembers = useMemo(() => {
    return data?.raw?.ActiveEmployees || [];
  }, [data]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" tip="Loading core team..." />
      </div>
    );
  }

  if (error) return <Card><Empty description={error} /></Card>;
  if (!teamMembers || teamMembers.length === 0) return <Empty description="No team members found." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <Title level={2} style={{ marginBottom: 8, fontWeight: 800 }}>Core Team</Title>
        <Text style={{ color: '#6b7280', fontSize: 16 }}>
          Displaying all active members from the ActiveEmployees directory.
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {teamMembers.map((member: any, index: number) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={member.Name || index}>
            <Card 
              hoverable
              bodyStyle={{ padding: 24, textAlign: 'center' }}
              style={{ 
                borderRadius: 16, 
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
              }}
              className="team-card"
            >
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                background: member.Type === 'Intern' ? '#fcd34d' : '#4f46e5' 
              }} />
              
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ 
                  marginBottom: 16, 
                  backgroundColor: '#f3f4f6', 
                  color: '#4f46e5',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontWeight: 800,
                  fontSize: 24
                }}
              >
                {member.Name?.substring(0, 2).toUpperCase()}
              </Avatar>

              <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>{member.Name}</Title>
              <Text style={{ color: '#4f46e5', fontWeight: 700, display: 'block', marginBottom: 12 }}>
                {member.Role}
              </Text>

              <Tag color={member.Type === 'Intern' ? 'gold' : 'blue'} style={{ borderRadius: 12, padding: '0 12px', fontWeight: 600, marginBottom: 20 }}>
                {member.Type}
              </Tag>

              <div style={{ 
                background: '#f9fafb', 
                borderRadius: 12, 
                padding: '12px 16px', 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 16,
                marginTop: 8
              }}>
                <a 
                  href={`https://github.com/${member.Github}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: member.Github ? '#111827' : '#d1d5db', fontSize: 18 }}
                  onClick={(e) => !member.Github && e.preventDefault()}
                >
                  <GithubOutlined />
                </a>
                <a 
                  href={`https://t.me/${member.Telegram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: member.Telegram ? '#0088cc' : '#d1d5db', fontSize: 18 }}
                  onClick={(e) => !member.Telegram && e.preventDefault()}
                >
                  <SendOutlined rotate={-30} />
                </a>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Summary Footer */}
      <Card style={{ borderRadius: 16, border: 'none', background: '#f0f4ff', padding: '8px 16px' }}>
        <Space size="large">
          <Space>
            <TeamOutlined style={{ color: '#4f46e5', fontSize: 20 }} />
            <Text strong>{teamMembers.length} Active Staff</Text>
          </Space>
          <Space>
            <Tag color="gold" style={{ borderRadius: 50, border: 'none' }} />
            <Text type="secondary">{teamMembers.filter((m: any) => m.Type === 'Intern').length} Interns</Text>
          </Space>
          <Space>
            <Tag color="blue" style={{ borderRadius: 50, border: 'none' }} />
            <Text type="secondary">{teamMembers.filter((m: any) => m.Type !== 'Intern').length} Full-time</Text>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default Team;
