import { Button, Card, Form, Input, notification, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { authService } from '@/services/authService';

const { Title } = Typography;

export default function ChangePasswordPage() {
  usePageTitle('Ndrysho Fjalëkalimin');
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await authService.changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirmation: values.confirm_password,
      });
      notification.success({ message: res.message ?? 'Fjalëkalimi u ndryshua me sukses.' });
      form.resetFields();
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Ndryshimi i fjalëkalimit dështoi.';
      notification.error({ message: msg });
    }
  };

  return (
    <div>
      <Title level={4}>Ndrysho Fjalëkalimin</Title>

      <Card style={{ maxWidth: 480, marginTop: 16 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="current_password"
            label="Fjalëkalimi aktual"
            rules={[{ required: true, message: 'Fjalëkalimi aktual është i detyrueshëm.' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Fjalëkalimi aktual" />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="Fjalëkalimi i ri"
            rules={[
              { required: true, message: 'Fjalëkalimi i ri është i detyrueshëm.' },
              { min: 8, message: 'Minimumi 8 karaktere.' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Fjalëkalimi i ri" />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Konfirmo fjalëkalimin"
            dependencies={['new_password']}
            rules={[
              { required: true, message: 'Konfirmimi është i detyrueshëm.' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Fjalëkalimet nuk përputhen.'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Konfirmo fjalëkalimin e ri" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Ndrysho fjalëkalimin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
