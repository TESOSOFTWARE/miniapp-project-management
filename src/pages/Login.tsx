import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined, MailOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const { Title, Text, Paragraph } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    const success = await login(values.email, values.password);
    setLoading(false);
    if (success) {
      message.success('Welcome back!');
      navigate('/');
    } else {
      message.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 24,
    }}>
      <Card
        style={{
          width: 420,
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: 'none',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '48px 40px 40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            background: '#4f46e5',
            color: 'white',
            width: 56,
            height: 56,
            borderRadius: 16,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)',
          }}>
            <AppstoreOutlined style={{ fontSize: 28 }} />
          </div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#111827' }}>
            ProManage
          </Title>
          <Paragraph style={{ color: '#6b7280', margin: '8px 0 0', fontSize: 15 }}>
            Sign in to your admin account
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
          initialValues={{ email: 'admin@promanage.com', password: 'admin123' }}
        >
          <Form.Item
            label={<Text strong style={{ fontSize: 13, color: '#374151' }}>Email Address</Text>}
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Invalid email' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
              placeholder="admin@promanage.com"
              size="large"
              style={{ borderRadius: 10, padding: '10px 14px' }}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ fontSize: 13, color: '#374151' }}>Password</Text>}
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="••••••••"
              size="large"
              style={{ borderRadius: 10, padding: '10px 14px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                borderRadius: 10,
                height: 48,
                fontWeight: 700,
                fontSize: 15,
                background: 'linear-gradient(135deg, #4f46e5. #7c3aed)',
                border: 'none',
                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size={4}>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>
              Default: admin@promanage.com / admin123
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;
