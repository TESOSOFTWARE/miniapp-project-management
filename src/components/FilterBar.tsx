import React from 'react';
import { Card, Select, Button, Space, Typography, Input } from 'antd';
import { FilterOutlined, AppstoreOutlined, UnorderedListOutlined, SearchOutlined } from '@ant-design/icons';
import { useDashboardStore } from '../store/useDashboardStore';
import { useDashboardData } from '../hooks/useDashboardData';

const { Text } = Typography;

const FilterBar: React.FC = () => {
  const { filters, setFilters } = useDashboardStore();
  const { data: dashboardData } = useDashboardData();

  if (!dashboardData || !dashboardData.raw) return null;

  const rawEmployees = dashboardData.raw.ActiveEmployees || [];
  const employees = Array.from(new Map(rawEmployees.map((e: any) => [e.Employee, e])).values());

  return (
    <Card 
      bodyStyle={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
      style={{ borderRadius: 12, marginBottom: 24, border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
    >
      <Space size="middle" align="center">
        <Space size="small" style={{ color: '#6b7280', fontWeight: 600, marginRight: 16 }}>
          <FilterOutlined />
          <Text style={{ color: '#6b7280', fontWeight: 600, letterSpacing: 1 }}>FILTERS</Text>
        </Space>
        
        <Input
          placeholder="Search projects..."
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          style={{ width: 220, borderRadius: 8, background: '#f3f4f6', border: 'none', marginRight: 8 }}
        />
        
        <Select
          allowClear
          placeholder="All Departments"
          style={{ width: 180 }}
          bordered={false}
          className="custom-pill-select"
        />

        <Select
          allowClear
          placeholder="Project Managers"
          style={{ width: 180 }}
          bordered={false}
          className="custom-pill-select"
          options={employees.map((e: any) => ({ label: e.Name || e.Employee, value: e.Employee }))}
          value={filters.employee}
          onChange={(val) => setFilters({ employee: val })}
        />

        <Select
          allowClear
          placeholder="Status"
          style={{ width: 140 }}
          bordered={false}
          className="custom-pill-select"
        />
      </Space>

      <Space size="middle">
        <Button type="text" icon={<AppstoreOutlined style={{ fontSize: 18, color: '#9ca3af' }} />} style={{ padding: '4px 8px' }} />
        <Button 
          type="text" 
          icon={<UnorderedListOutlined style={{ fontSize: 18, color: '#4f46e5' }} />} 
          style={{ background: '#eef2ff', borderRadius: 8, padding: '4px 8px' }} 
        />
      </Space>
    </Card>
  );
};

export default FilterBar;
