import { useState } from 'react';
import { Button, Card, Form, Input, notification, Select, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function NjoftimetPage() {
  usePageTitle('Njoftimet');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        body: values.body,
        type: values.type,
        recipient_role: values.recipient_role,
      };
      const res = await adminService.sendNotification(payload);
      notification.success({ message: res.message ?? 'Njoftimi u dërgua me sukses.' });
      form.resetFields();
    } catch {
      notification.error({ message: 'Dërgimi i njoftimit dështoi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={4}>Dërgo Njoftim</Title>
      <Text type="secondary">
        Dërgo njoftim tek studentët, pedagogët ose të gjithë përdoruesit.
      </Text>

      <Card style={{ marginTop: 24, maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Titulli"
            rules={[{ required: true, message: 'Titulli është i detyrueshëm.' }]}
          >
            <Input placeholder="Titulli i njoftimit" maxLength={200} showCount />
          </Form.Item>

          <Form.Item
            name="body"
            label="Mesazhi"
            rules={[{ required: true, message: 'Mesazhi është i detyrueshëm.' }]}
          >
            <TextArea rows={4} placeholder="Shkruani mesazhin këtu..." />
          </Form.Item>

          <Form.Item name="type" label="Lloji" initialValue="info" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'info', label: 'Informacion' },
                { value: 'sukses', label: 'Sukses' },
                { value: 'paralajmerim', label: 'Paralajmërim' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="recipient_role"
            label="Dërgo tek"
            initialValue="all"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 'all', label: 'Të gjithë' },
                { value: 'student', label: 'Studentët' },
                { value: 'pedagog', label: 'Pedagogët' },
                { value: 'admin', label: 'Adminët' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
              Dërgo njoftimin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
