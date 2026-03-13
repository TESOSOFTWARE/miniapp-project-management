import React from 'react';
import {
  BellOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Avatar, Button, Space, Typography } from 'antd';
import { useDashboardStore } from '../store/useDashboardStore';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, setFilters } = useDashboardStore();

  const menuItems = [
    { key: '/overview', label: 'Overview' },
    { key: '/', label: 'Projects' },
    { key: '/team', label: 'Team' },
    { key: '/finances', label: 'Finances' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: '#fff', 
          padding: '0 32px',
          borderBottom: '1px solid #f0f0f0',
          height: 72
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ 
              background: '#4f46e5', 
              color: 'white', 
              width: 32, 
              height: 32, 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <AppstoreOutlined style={{ fontSize: 18 }} />
            </div>
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>ProManage</Title>
          </div>
          
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderBottom: 'none', lineHeight: '70px', minWidth: 400, fontSize: 15, fontWeight: 600 }}
          />
        </div>

        <Space size="large" align="center">
          <Input 
            prefix={<SearchOutlined style={{color: '#bfbfbf'}}/>} 
            placeholder="Search projects..." 
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            style={{ width: 240, borderRadius: 8, background: '#f8f9fa', border: 'none', padding: '6px 16px' }}
          />
          <Space size="middle">
            <Button type="text" shape="circle" icon={<BellOutlined />} style={{ background: '#f8f9fa', border: 'none' }} />
            <Button type="text" shape="circle" icon={<SettingOutlined />} onClick={() => navigate('/settings')} style={{ background: '#f8f9fa', border: 'none' }} />
            <Avatar style={{ backgroundColor: '#fcd34d', color: '#b45309', cursor: 'pointer', fontWeight: 600 }}>JD</Avatar>
          </Space>
        </Space>
      </Header>

      <Content style={{ padding: '32px 48px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
