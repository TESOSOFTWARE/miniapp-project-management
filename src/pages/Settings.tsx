import React, { useState } from 'react';
import { Card, Input, Button, Typography, Alert, Space } from 'antd';
import { SaveOutlined, LinkOutlined } from '@ant-design/icons';
import { useDashboardStore } from '../store/useDashboardStore';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const { sheetId, setSheetId, setError } = useDashboardStore();
  const [inputValue, setInputValue] = useState(sheetId);
  const navigate = useNavigate();

  const handleSave = () => {
    let finalId = inputValue.trim();
    
    // Extract ID from URL if full URL is provided
    if (finalId.includes('docs.google.com/spreadsheets/d/')) {
      const match = finalId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) finalId = match[1];
    }

    if (finalId) {
      setSheetId(finalId);
      setError(null);
      // Redirect to overview after saving
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={2}>Configuration</Title>
      <Text type="secondary">Enter your Google Sheet ID or URL to get started.</Text>
      
      <Card style={{ marginTop: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Google Sheet ID / URL</Text>
            <Input 
              prefix={<LinkOutlined />}
              placeholder="e.g. 1a2b3c4d5e... or full URL" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </div>
          
          <Alert
            message="Required Sharing Settings"
            description="The Google Sheet must be 'Published to the Web' or shared as 'Anyone with the link can view' for the app to access data."
            type="info"
            showIcon
          />

          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            disabled={!inputValue}
          >
            Save Configuration
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Settings;
