import React, { useMemo } from 'react';
import { Table, Progress, Tag, Avatar, Button } from 'antd';
import { 
  CheckCircleFilled, 
  ClockCircleFilled, 
  ExclamationCircleFilled,
  MoreOutlined
} from '@ant-design/icons';
import { formatDisplayDate, isDateOverdue } from '../utils/dateUtils';

interface ProjectListTableProps {
  data: any[];
}

const ProjectListTable: React.FC<ProjectListTableProps> = ({ data }) => {
  const columns = useMemo(() => {
    return [
      {
        title: 'PROJECT NAME',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        render: (text: string, record: any) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, color: '#111827', fontSize: 14 }}>{text || 'Untitled Project'}</span>
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              {record.Department || 'Engineering'} • #{record.ProjectId || 'PRJ-000'}
            </span>
          </div>
        )
      },
      {
        title: 'PROGRESS',
        key: 'progress',
        render: (_: any, record: any) => {
          let percent = 0;
          const burnVal = record['% Burn'];
          
          if (typeof burnVal === 'number') {
            percent = Math.round(burnVal * (burnVal <= 1 ? 100 : 1));
          } else if (typeof burnVal === 'string') {
            const parsed = parseFloat(burnVal.replace('%', ''));
            if (!isNaN(parsed)) percent = Math.round(parsed);
          }
          
          let strokeColor = '#4f46e5'; // Purple for normal
          if (percent === 100) strokeColor = '#10b981'; // Green for complete
          if (record.Priority === 'Urgent' || record.Priority === 'High') strokeColor = '#ef4444'; // Red for delayed/urgent

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 140 }}>
              <Progress 
                percent={percent} 
                showInfo={false} 
                strokeColor={strokeColor}
                trailColor="#e5e7eb"
                style={{ flex: 1, margin: 0 }}
                className="mockup-progress"
                strokeWidth={6}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4b5563', width: 35 }}>{percent}%</span>
            </div>
          );
        }
      },
      {
        title: 'STATUS',
        dataIndex: 'Status',
        key: 'status',
        render: (_: any, record: any) => {
          const state = record['Dev Status'];
          let label = state ? String(state).trim() : 'No Status';
          
          let color = '#dbeafe';
          let textColor = '#2563eb';

          if (label.toLowerCase().includes('delayed') || label.toLowerCase().includes('bug')) {
             color = '#fee2e2';
             textColor = '#dc2626';
          }
          if (label.toLowerCase() === 'done' || label.toLowerCase().includes('complete') || label.toLowerCase().includes('live')) {
             color = '#d1fae5';
             textColor = '#10b981';
          }

          if (label === 'No Status') {
             color = '#f3f4f6';
             textColor = '#6b7280';
             label = 'N/A';
          }

          return (
            <Tag style={{ 
              background: color, 
              color: textColor, 
              border: 'none', 
              borderRadius: 16, 
              padding: '4px 12px',
              fontWeight: 700,
              fontSize: 12
            }}>
              {label}
            </Tag>
          );
        }
      },
      {
        title: 'MANAGER',
        key: 'manager',
        render: (_: any, record: any) => {
          const name = record['Intake Assignee'] || 'Unassigned';
          const initials = name.substring(0, 2).toUpperCase() || 'UN';
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar style={{ backgroundColor: '#1f2937', color: 'white', fontWeight: 600, fontSize: 12 }} size={32}>
                {initials}
              </Avatar>
              <span style={{ fontWeight: 700, color: '#374151', fontSize: 14 }}>{name}</span>
            </div>
          );
        }
      },
      {
        title: 'PAYMENT STATUS',
        key: 'payment',
        render: (_: any, record: any) => {
           // Mocking payment status for visual exactly like mockup
           const priority = record.Priority || '';
           
           if (priority === 'High' || priority === 'Urgent') {
             return (
              <Tag style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: 16, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                <ExclamationCircleFilled /> <span style={{ fontWeight: 700 }}>Overdue</span>
              </Tag>
             )
           }
           if (priority === 'Medium') {
             return (
              <Tag style={{ background: '#fefce8', color: '#ca8a04', border: '1px solid #fde047', borderRadius: 16, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                <ClockCircleFilled /> <span style={{ fontWeight: 700 }}>Pending</span>
              </Tag>
             )
           }
           return (
            <Tag style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #6ee7b7', borderRadius: 16, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
              <CheckCircleFilled /> <span style={{ fontWeight: 700 }}>Paid</span>
            </Tag>
           )
        }
      },
      {
        title: 'DUE DATE',
        dataIndex: 'Date',
        key: 'date',
        render: (_: any, record: any) => {
          const dateVal = record['End Dev'];
          const dateStr = formatDisplayDate(dateVal);
          const overdue = isDateOverdue(dateVal);
          
          return (
            <span style={{ color: overdue ? '#ef4444' : '#6b7280', fontWeight: overdue ? 700 : 500, fontSize: 13 }}>
              {dateStr} {overdue && '(Overdue)'}
            </span>
          )
        }
      },
      {
        title: '',
        key: 'action',
        width: 60,
        render: () => (
          <Button type="text" icon={<MoreOutlined style={{ fontSize: 20, color: '#9ca3af' }} />} />
        )
      }
    ];
  }, []);

  return (
    <Table 
      columns={columns} 
      dataSource={data}
      className="custom-project-table"
      pagination={{ 
        position: ['bottomRight'],
        showSizeChanger: false,
        showTotal: (total, range) => <span style={{ color: '#6b7280', fontWeight: 500, float: 'left' }}>Showing {range[0]} to {range[1]} of {total} projects</span>,
        itemRender: (_, type, originalElement) => {
          if (type === 'prev') return <a>Previous</a>;
          if (type === 'next') return <a>Next</a>;
          return originalElement;
        }
      }}
    />
  );
};

export default ProjectListTable;
