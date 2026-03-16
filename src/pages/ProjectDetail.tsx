import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Typography, Tag, Progress, Descriptions, Space, 
  Button, Spin, Empty, Timeline 
} from 'antd';
import {
  ArrowLeftOutlined, CalendarOutlined, UserOutlined, 
  ClockCircleOutlined, RocketOutlined, CheckCircleFilled, ExclamationCircleFilled
} from '@ant-design/icons';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatDisplayDate, isDateOverdue, parseSheetDate } from '../utils/dateUtils';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const statusColorMap: Record<string, { bg: string; text: string }> = {
  done: { bg: '#d1fae5', text: '#10b981' },
  live: { bg: '#d1fae5', text: '#10b981' },
  complete: { bg: '#d1fae5', text: '#10b981' },
  delayed: { bg: '#fee2e2', text: '#dc2626' },
  bug: { bg: '#fee2e2', text: '#dc2626' },
  default: { bg: '#dbeafe', text: '#2563eb' },
  none: { bg: '#f3f4f6', text: '#6b7280' },
};

const getStatusStyle = (status: string) => {
  const lower = (status || '').toLowerCase();
  for (const key of Object.keys(statusColorMap)) {
    if (key !== 'default' && key !== 'none' && lower.includes(key)) return statusColorMap[key];
  }
  if (!status || lower === 'no status') return statusColorMap.none;
  return statusColorMap.default;
};

const ProjectDetail: React.FC = () => {
  const { projectIndex } = useParams<{ projectIndex: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDashboardData();

  const project = useMemo(() => {
    const projects = data?.raw?.ProjectSummary || [];
    const idx = parseInt(projectIndex || '0', 10);
    return projects[idx] || null;
  }, [data, projectIndex]);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  if (!project) {
    return <Empty description="Project not found." />;
  }

  const devStatus = project['Dev Status'] || 'N/A';
  const intakeStatus = project['Intake Status'] || 'N/A';
  const statusStyle = getStatusStyle(devStatus);
  const manager = project['Intake Assignee'] || 'Unassigned';
  const startDev = formatDisplayDate(project['Start Dev']);
  const endDev = formatDisplayDate(project['End Dev']);
  const startDate = formatDisplayDate(project['Start Date']);
  const endDate = formatDisplayDate(project['End Date']);
  const overdue = isDateOverdue(project['End Dev']);
  const priority = project['Priority'] || 'Normal';

  // Progress
  let percent = 0;
  const burnVal = project['% Burn'];
  if (typeof burnVal === 'number') {
    percent = Math.round(burnVal * (burnVal <= 1 ? 100 : 1));
  } else if (typeof burnVal === 'string') {
    const parsed = parseFloat(burnVal.replace('%', ''));
    if (!isNaN(parsed)) percent = Math.round(parsed);
  }

  // Effort
  const estimated = project['Estimated effort (md)'] || '—';
  const planned = project['Planned effort (md)'] || '—';
  const burned = project['Burned Effort (md)'] || '—';
  const plannedPct = project['% Planned'] || '—';

  // Dev duration
  const parsedStart = parseSheetDate(project['Start Dev']);
  const parsedEnd = parseSheetDate(project['End Dev']);
  const durationDays = parsedStart && parsedEnd ? parsedEnd.diff(parsedStart, 'day') : null;
  const daysRemaining = parsedEnd ? parsedEnd.diff(dayjs(), 'day') : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')} 
          style={{ fontWeight: 600, fontSize: 15, padding: '4px 12px', borderRadius: 10 }}
        >
          Back
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
            {project.ProjectName || project.Project || 'Untitled Project'}
          </Title>
          <Space size="middle" style={{ marginTop: 8 }}>
            <Tag style={{ ...tagStyle(statusStyle), padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
              {devStatus}
            </Tag>
            <Text type="secondary">Priority: <Text strong style={{ color: priority === 'High' || priority === 'Urgent' ? '#ef4444' : '#374151' }}>{priority}</Text></Text>
          </Space>
        </div>
      </div>

      {/* Key Metrics Row */}
      <Row gutter={[20, 20]}>
        {[
          { label: 'Progress', value: `${percent}%`, icon: <RocketOutlined />, color: '#4f46e5', extra: <Progress percent={percent} showInfo={false} strokeColor="#4f46e5" trailColor="#e5e7eb" strokeWidth={6} style={{ width: 120, marginTop: 8 }} /> },
          { label: 'Days Remaining', value: daysRemaining !== null ? (daysRemaining >= 0 ? `${daysRemaining} days` : `${Math.abs(daysRemaining)} days overdue`) : '—', icon: <ClockCircleOutlined />, color: overdue ? '#ef4444' : '#10b981' },
          { label: 'Duration', value: durationDays !== null ? `${durationDays} days` : '—', icon: <CalendarOutlined />, color: '#7c3aed' },
          { label: 'Manager', value: manager, icon: <UserOutlined />, color: '#0891b2' },
        ].map((m) => (
          <Col xs={24} sm={12} lg={6} key={m.label}>
            <Card style={{ borderRadius: 14, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px 24px' }}>
              <Space direction="vertical" size={4}>
                <Space>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}14`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {m.icon}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{m.label}</Text>
                </Space>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: m.color }}>{m.value}</Title>
                {m.extra}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Details Sections */}
      <Row gutter={[24, 24]}>
        {/* Project Info */}
        <Col xs={24} lg={14}>
          <Card title={<Text strong style={{ fontSize: 16 }}>Project Information</Text>} style={{ borderRadius: 14, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Descriptions column={2} size="small" labelStyle={{ fontWeight: 600, color: '#6b7280', fontSize: 13 }} contentStyle={{ fontSize: 13, fontWeight: 500 }}>
              <Descriptions.Item label="Project Name">{project.ProjectName || project.Project}</Descriptions.Item>
              <Descriptions.Item label="Manager">{manager}</Descriptions.Item>
              <Descriptions.Item label="Dev Status">
                <Tag style={{ ...tagStyle(statusStyle), fontWeight: 700 }}>{devStatus}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Intake Status">
                <Tag style={{ ...tagStyle(getStatusStyle(intakeStatus)), fontWeight: 700 }}>{intakeStatus}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={priority === 'High' || priority === 'Urgent' ? 'red' : priority === 'Medium' ? 'gold' : 'blue'}>
                  {priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Intake Git">{project['Intake Git'] || '—'}</Descriptions.Item>
              <Descriptions.Item label="Dev Git">{project['Dev Git'] || '—'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Effort Breakdown */}
        <Col xs={24} lg={10}>
          <Card title={<Text strong style={{ fontSize: 16 }}>Effort Breakdown</Text>} style={{ borderRadius: 14, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Estimated Effort', value: `${estimated} md`, pct: null },
                { label: 'Planned Effort', value: `${planned} md`, pct: plannedPct },
                { label: 'Burned Effort', value: `${burned} md`, pct: `${percent}%` },
              ].map((e) => (
                <div key={e.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f9fafb', borderRadius: 10 }}>
                  <Text style={{ fontWeight: 600, color: '#374151' }}>{e.label}</Text>
                  <Space>
                    <Text strong style={{ fontSize: 15 }}>{e.value}</Text>
                    {e.pct && <Tag style={{ borderRadius: 12, background: '#eef2ff', border: 'none', color: '#4f46e5', fontWeight: 700 }}>{e.pct}</Tag>}
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Timeline */}
      <Card title={<Text strong style={{ fontSize: 16 }}>Project Timeline</Text>} style={{ borderRadius: 14, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <Timeline
          mode="left"
          items={[
            { color: '#4f46e5', children: <><Text strong>Contract Start</Text><br /><Text type="secondary">{startDate}</Text></> },
            { color: '#7c3aed', children: <><Text strong>Dev Start</Text><br /><Text type="secondary">{startDev}</Text></> },
            { color: overdue ? '#ef4444' : '#10b981', dot: overdue ? <ExclamationCircleFilled style={{ color: '#ef4444' }} /> : <CheckCircleFilled style={{ color: '#10b981' }} />, children: <><Text strong>Dev End {overdue ? '(Overdue)' : ''}</Text><br /><Text type="secondary">{endDev}</Text></> },
            { color: '#6b7280', children: <><Text strong>Contract End</Text><br /><Text type="secondary">{endDate}</Text></> },
          ]}
        />
      </Card>
    </div>
  );
};

const tagStyle = (s: { bg: string; text: string }) => ({
  background: s.bg,
  color: s.text,
  border: 'none',
  borderRadius: 16,
  padding: '2px 10px',
  fontSize: 12,
});

export default ProjectDetail;
