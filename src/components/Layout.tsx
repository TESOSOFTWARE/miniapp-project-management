import React from 'react';
import {
  BellOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SearchOutlined,
  LogoutOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Avatar, Button, Space, Typography, Dropdown, Tag } from 'antd';
import { useDashboardStore } from '../store/useDashboardStore';
import { useAuthStore } from '../store/useAuthStore';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, setFilters } = useDashboardStore();
  const { currentUser, logout } = useAuthStore();

  const menuItems = [
    { key: '/overview', label: 'Overview' },
    { key: '/', label: 'Projects' },
    { key: '/team', label: 'Team' },
    { key: '/finances', label: 'Finances' },
  ];

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const userMenuItems = [
    {
      key: 'profile-header',
      label: (
        <div style={{ padding: '4px 0' }}>
          <Text strong style={{ display: 'block', fontSize: 14 }}>{currentUser?.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{currentUser?.email}</Text>
          <Tag style={{ marginTop: 4, borderRadius: 12, fontSize: 10, fontWeight: 700, background: isSuperAdmin ? '#eef2ff' : '#f3f4f6', color: isSuperAdmin ? '#4f46e5' : '#6b7280', border: 'none' }}>
            {isSuperAdmin ? 'Super Admin' : currentUser?.role === 'ADMIN' ? 'Admin' : 'Viewer'}
          </Tag>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' as const },
    ...(isSuperAdmin ? [
      {
        key: 'admin',
        label: 'Administration',
        icon: <CrownOutlined />,
        onClick: () => navigate('/admin'),
      },
      {
        key: 'settings',
        label: 'Configuration',
        icon: <SettingOutlined />,
        onClick: () => navigate('/settings'),
      },
    ] : []),
    { type: 'divider' as const },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => { logout(); navigate('/login'); },
    },
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
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Avatar
                style={{
                  backgroundColor: currentUser?.role === 'SUPER_ADMIN' ? '#4f46e5' : '#0891b2',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 13,
                }}
                icon={!currentUser && <UserOutlined />}
              >
                {currentUser?.avatar || currentUser?.name?.substring(0, 2).toUpperCase()}
              </Avatar>
            </Dropdown>
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
