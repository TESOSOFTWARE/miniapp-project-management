import React, { useState } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, Select, Tag, Space,
  Typography, Avatar, Popconfirm, message, Checkbox, Row, Col, Divider
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined,
  CrownOutlined, SafetyCertificateOutlined, EyeOutlined
} from '@ant-design/icons';
import { useAuthStore, type AdminUser, type UserRole } from '../store/useAuthStore';

const { Title, Text } = Typography;

const AVAILABLE_PERMISSIONS = [
  { key: 'view_dashboard', label: 'View Dashboard', description: 'Access project dashboards' },
  { key: 'manage_projects', label: 'Manage Projects', description: 'Create, edit, delete projects' },
  { key: 'view_team', label: 'View Team', description: 'Access team member directory' },
  { key: 'manage_team', label: 'Manage Team', description: 'Add or remove team members' },
  { key: 'view_finances', label: 'View Finances', description: 'Access financial reports' },
  { key: 'manage_finances', label: 'Manage Finances', description: 'Edit budgets and payments' },
  { key: 'manage_settings', label: 'Manage Settings', description: 'Change application settings' },
  { key: 'manage_admins', label: 'Manage Admins', description: 'Add or remove admin users' },
];

const ROLE_CONFIG: Record<UserRole, { color: string; icon: React.ReactNode; label: string }> = {
  SUPER_ADMIN: { color: '#4f46e5', icon: <CrownOutlined />, label: 'Super Admin' },
  ADMIN: { color: '#0891b2', icon: <SafetyCertificateOutlined />, label: 'Admin' },
  VIEWER: { color: '#6b7280', icon: <EyeOutlined />, label: 'Viewer' },
};

const AdminManagement: React.FC = () => {
  const { allUsers, currentUser, addUser, removeUser, updatePermissions } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form] = Form.useForm();

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: 'ADMIN', permissions: ['view_dashboard'] });
    setIsModalOpen(true);
  };

  const handleEditPermissions = (user: AdminUser) => {
    setEditingUser(user);
    form.setFieldsValue({ permissions: user.permissions });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        updatePermissions(editingUser.id, values.permissions);
        message.success(`Permissions updated for ${editingUser.name}`);
      } else {
        addUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          permissions: values.permissions || [],
          avatar: values.name?.substring(0, 2).toUpperCase(),
        });
        message.success(`Admin "${values.name}" added successfully. They can log in with their email and password.`);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // validation failed
    }
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      message.error("You cannot delete your own account.");
      return;
    }
    removeUser(id);
    message.success("User removed.");
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: unknown, record: AdminUser) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: ROLE_CONFIG[record.role]?.color || '#6b7280',
              fontWeight: 700,
              fontSize: 13,
            }}
            size={40}
          >
            {record.avatar || record.name?.substring(0, 2).toUpperCase()}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => {
        const config = ROLE_CONFIG[role] || ROLE_CONFIG.VIEWER;
        return (
          <Tag
            icon={config.icon}
            color={config.color}
            style={{ borderRadius: 20, padding: '2px 12px', fontWeight: 600, fontSize: 12, border: 'none' }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space wrap size={[4, 4]}>
          {permissions.includes('all') ? (
            <Tag color="purple" style={{ borderRadius: 12, fontWeight: 600, border: 'none' }}>All Access</Tag>
          ) : (
            permissions.slice(0, 3).map((p) => (
              <Tag key={p} style={{ borderRadius: 12, fontSize: 11, background: '#f3f4f6', border: 'none', color: '#374151' }}>
                {AVAILABLE_PERMISSIONS.find((ap) => ap.key === p)?.label || p}
              </Tag>
            ))
          )}
          {!permissions.includes('all') && permissions.length > 3 && (
            <Tag style={{ borderRadius: 12, fontSize: 11, background: '#eef2ff', border: 'none', color: '#4f46e5' }}>
              +{permissions.length - 3} more
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: AdminUser) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPermissions(record)}
            style={{ color: '#4f46e5' }}
          />
          <Popconfirm
            title="Remove this admin?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Remove"
            okType="danger"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              disabled={record.id === currentUser?.id}
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Administration</Title>
          <Text style={{ color: '#6b7280', fontSize: 15 }}>
            Manage admin accounts and access permissions.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          size="large"
          style={{
            borderRadius: 10,
            fontWeight: 700,
            background: '#4f46e5',
            border: 'none',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
          }}
        >
          Add Admin
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={16}>
        {[
          { label: 'Total Admins', value: allUsers.length, color: '#4f46e5', icon: <UserOutlined /> },
          { label: 'Super Admins', value: allUsers.filter(u => u.role === 'SUPER_ADMIN').length, color: '#7c3aed', icon: <CrownOutlined /> },
          { label: 'Regular Admins', value: allUsers.filter(u => u.role === 'ADMIN').length, color: '#0891b2', icon: <SafetyCertificateOutlined /> },
          { label: 'Viewers', value: allUsers.filter(u => u.role === 'VIEWER').length, color: '#6b7280', icon: <EyeOutlined /> },
        ].map((stat) => (
          <Col span={6} key={stat.label}>
            <Card
              style={{ borderRadius: 14, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Space>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${stat.color}14`,
                  color: stat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {stat.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{stat.label}</Text>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: stat.color }}>{stat.value}</Title>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card
        style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          dataSource={allUsers}
          columns={columns}
          rowKey="id"
          pagination={false}
          style={{ borderRadius: 16, overflow: 'hidden' }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <Space>
            {editingUser ? <EditOutlined /> : <PlusOutlined />}
            <Text strong style={{ fontSize: 16 }}>
              {editingUser ? `Edit Permissions: ${editingUser.name}` : 'Add New Admin'}
            </Text>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        onOk={handleSubmit}
        okText={editingUser ? 'Update Permissions' : 'Add Admin'}
        okButtonProps={{
          style: { background: '#4f46e5', borderColor: '#4f46e5', borderRadius: 8, fontWeight: 600 }
        }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        width={560}
        styles={{ body: { paddingTop: 16 } }}
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          {!editingUser && (
            <>
              <Form.Item
                label={<Text strong style={{ fontSize: 13 }}>Full Name</Text>}
                name="name"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input placeholder="Jane Doe" style={{ borderRadius: 8 }} size="large" />
              </Form.Item>
              <Form.Item
                label={<Text strong style={{ fontSize: 13 }}>Email Address</Text>}
                name="email"
                rules={[{ required: true, message: 'Email is required' }, { type: 'email' }]}
              >
                <Input placeholder="jane@promanage.com" style={{ borderRadius: 8 }} size="large" />
              </Form.Item>
              <Form.Item
                label={<Text strong style={{ fontSize: 13 }}>Role</Text>}
                name="role"
                rules={[{ required: true }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="SUPER_ADMIN">
                    <Space><CrownOutlined style={{ color: '#4f46e5' }} /> Super Admin</Space>
                  </Select.Option>
                  <Select.Option value="ADMIN">
                    <Space><SafetyCertificateOutlined style={{ color: '#0891b2' }} /> Admin</Space>
                  </Select.Option>
                  <Select.Option value="VIEWER">
                    <Space><EyeOutlined style={{ color: '#6b7280' }} /> Viewer</Space>
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={<Text strong style={{ fontSize: 13 }}>Password</Text>}
                name="password"
                rules={[{ required: true, message: 'Password is required' }, { min: 6, message: 'Minimum 6 characters' }]}
              >
                <Input.Password placeholder="Min 6 characters" style={{ borderRadius: 8 }} size="large" />
              </Form.Item>
            </>
          )}

          <Divider style={{ margin: '8px 0 16px' }} />

          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Permissions</Text>}
            name="permissions"
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[0, 12]}>
                {AVAILABLE_PERMISSIONS.map((p) => (
                  <Col span={12} key={p.key}>
                    <Checkbox value={p.key}>
                      <div>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>{p.description}</Text>
                      </div>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
